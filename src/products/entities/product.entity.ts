import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ApiProperty } from "@nestjs/swagger";

import { ProductImage } from './';
import { User         } from "src/auth/entities/user.entity";


@Entity({ name: 'products' })
export class Product {

    @ApiProperty({
        example: '03be4eab-2674-4e2a-b24d-48bfb1094c27',
        description: 'Product ID generated with UUID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ApiProperty({
        example: "Men's Raven Lightweight Zip Up Bomber Jacket",
        description: 'Product Title',
        uniqueItems: true
    })
    @Column('text', {
        unique: true,
    })
    title: string;

    @ApiProperty({
        example: 39.99,
        description: 'Product Price',
    })    
    @Column('float', {
        default: 0
    })
    price: number;

    @ApiProperty({
        example: "Introducing the Tesla Raven Collection. The Men's Raven Lightweight Zip Up Bomber has a premium, modern silhouette made from a sustainable bamboo cotton blend for versatility in any season. The hoodie features subtle thermoplastic polyurethane Tesla logos on the left chest and below the back collar, a concealed chest pocket with custom matte zipper pulls and a french terry interior. Made from 70% bamboo and 30% cotton.",
        description: 'Product Description',
    })
    @Column({
        type    : 'text',
        nullable: true,
        default: null
    })
    description: string;

    
    @ApiProperty({
        example: 'men_raven_lightweight_zip_up_bomber_jacket',
        description: 'Product Slug - SEO',
    })
    @Column('text', {
        unique: true
    })
    slug: string;

    @ApiProperty({
        example: 10,
        description: 'Product Stock Quantity',
        default: 0
    })
    @Column('int', {
        default: 0
    })
    stock: number;

    
    @ApiProperty({
        example: ['S','M','L','XL','XXL'],
        description: 'Product Available Sizes',
        default: 0
    })
    @Column('text', {
        array: true
    })
    sizes: string[];

    @ApiProperty({
        example: 'men',
        description: 'Product Gender',
    })
    @Column('text')
    gender: string;

    @ApiProperty({
        example: ['shirt'],
        description: 'Product tags - SEO',
    })
    @Column('text', {
        array  : true,
        default: []
    })
    tags: string[];

    @ApiProperty()
    @OneToMany(
        () => ProductImage, 
        (productImage) => productImage.product,
        { cascade: true, eager: true }
    )
    images: ProductImage[];

    @ApiProperty()
    @ManyToOne(
        () => User,
        (user) => user.product,
        { eager: true}
    )
    user: User;

    @BeforeInsert()
    checkSlugInsert() {
        if ( !this.slug ) {
            this.slug = this.title
        }

        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
    }

    @BeforeUpdate()
    checkSlugUpdate() {
        this.slug = this.slug
            .toLowerCase()
            .replaceAll(' ', '_')
            .replaceAll("'", '')
            .replaceAll("´",'')
    }
}
