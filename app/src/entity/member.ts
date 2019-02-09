import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import Issue from './issue';

@Entity()
export default class Member {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column({ unique: true })
	username?: string;

	@Column({ nullable: true })
	nickname?: string;

	@Column()
	password?: string;

	@Column({ nullable: true })
	avatart?: string;

	@Column({ nullable: true })
	bio?: string;

	@Column('simple-array')
	group?: number[];

	@ManyToMany(type => Issue, issue => issue.repairers, { cascadeInsert: true, cascadeUpdate: true })
	works?: Issue[];
}