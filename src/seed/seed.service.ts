import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import * as bcrypt from 'bcrypt';

import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { promises } from 'dns';
import { User } from '../auth/entities/user.entity';
import { read } from 'fs';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {
  
  constructor ( 
      private readonly productsService: ProductsService,

      @InjectRepository( User )
      private readonly userRepository: Repository<User>
    ) {}

  async runSeed() {

    await this.deleteTables();

    const adminUser = await this.inserUsers();

    await this.loadTestDataInDB( adminUser );

    return "Seed executed Ok"
  }

  private async deleteTables(){
    //primero borrar todos los productos para evitar errores
    //y como está en "cascade" va a borrar las imagenes tambien
    await this.productsService.deleteAllProducts();

    //Ahora borrar los usuarios
    const queryBuilder = this.userRepository.createQueryBuilder();

    await queryBuilder
      .delete()
      .where({}) // es un *.*
      .execute()
  }

  private async inserUsers() {

    const seedUsers = initialData.users;

    const users: User[] = [];

    seedUsers.forEach( user => {
      let { password, ...userData } = user;
      user.password = bcrypt.hashSync( password, 10 );
      users.push( this.userRepository.create( user ))
    });

    const dbUsers = await this.userRepository.save( seedUsers );

    return dbUsers[0];
  }

  private async loadTestDataInDB(user: User) {

    // await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];

    products.forEach( product => {
      insertPromises.push (this.productsService.create( product, user ));
    })

    await Promise.all( insertPromises );

    return true;
  }

}
