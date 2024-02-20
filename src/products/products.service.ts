import { BadRequestException, Injectable, InternalServerErrorException, 
         Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common/dtos/pagination.dto';
import { DataSource, Repository } from 'typeorm';
import { validate as isUUID } from 'uuid';
import { Product, ProductImage } from './entities';
import { User } from 'src/auth/entities/user.entity';



@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService');

  constructor(

    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly dataSource: DataSource,

  ) {}

  async create(createProductDto: CreateProductDto, user: User) {
    
    try {

      const { images = [], ...productDetail} = createProductDto;
      
      const product = this.productRepository.create( 
        {...productDetail,
            images: images.map( image => this.productImageRepository.create({ url: image })),
            user,
        });
      await this.productRepository.save( product );

      return {...product, images}; //para devolver las imagenes tal cual fueron enviadas y 
                                   // sin el id de postgres

    } catch (error) {

      this.handleDBExceptions( error );

    }
  }

  async findAll( paginationDto: PaginationDto) {
    const {limit = 5, offset = 0} = paginationDto;
    const products = await this.productRepository.find({
      take: limit,
      skip: offset,
      order: {
        title: 'ASC'
      },
      relations: {
        images: true,
      }
    });

    return products.map ( product => ({
      ...product,
      images: product.images.map( img => img.url)
    }))
    
  }

  async findOne(term: string) {

    let product: Product;
  
    if ( isUUID( term ) ) {
      product =  await this.productRepository.findOneBy( { id: term } );
    }
    else {
      const queryBuilder = this.productRepository.createQueryBuilder('prod');

      product = await queryBuilder
        .where('UPPER(title) = :title or slug = :slug', {
          title: term.toUpperCase(),
          slug : term.toLowerCase(),
        })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    if (!product) {
      throw new NotFoundException(`There is no any product with id: ${term}`);
    }

    return {...product,
      images: product.images.map( img => img.url)};
  }

  async update(id: string, updateProductDto: UpdateProductDto, user: User) {

    const {images, ...updateFields } = updateProductDto;

    const product = await this.productRepository.preload({ id, ...updateFields });
    
    if (!product) {
      throw new NotFoundException(`There is no any product with id: ${id}`);
    }

    //Create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    
    try {

      if ( images ) {
        await queryRunner.manager.delete( ProductImage, { product: {id: id}});

        product.images = images.map(image => this.productImageRepository.create({ url: image }));
      }
      else {
        product.images = await this.productImageRepository.findBy({ product: {id: id}});
      }

      product.user = user;
      await queryRunner.manager.save( product );

      await queryRunner.commitTransaction();

      await queryRunner.release();

      return product;

      //return await this.productRepository.save( product );

    } catch (error) {

        await queryRunner.rollbackTransaction();

        this.handleDBExceptions( error );

    }
    
  }

  async remove(id: string) {
    const {affected} = await this.productRepository.delete( id );
    if (affected === 0) {
      throw new BadRequestException(`This id: ${id} was not found`);
  }
    return `Product ${id} has left the building`;
  }

  private handleDBExceptions( error: any ): never {
    if ( error.code === '23505' ) { //23505 --> constrait de llave duplicada
      throw new BadRequestException(error.detail);
    }

    this.logger.error(error);
    throw new InternalServerErrorException('Unexpected error, please check logs');
  }

  async deleteAllProducts() {
    const query = this.productRepository.createQueryBuilder('product');

    try {
      await query.delete().where({}).execute();
      return ('All the products and its images has been deleted of the DB')

    } catch (error) {
       this.handleDBExceptions( error )
    }
  }

}
