import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany, JoinTable } from 'typeorm';
import { generate as genRandomString } from 'randomstring';
import Member from './member';

@Entity()
export default class Issue {
	@PrimaryGeneratedColumn()
	id?: number;

	@Column()
	name: string;

	@Column()
	phone: number;

	@Column({ nullable: true })
	describe?: string;

	@Column()
	type: 'computer' | 'electric';

	@Column()
	teardown: boolean;

	@Column({ nullable: true })
	password?: string;

	@Column({ nullable: true })
	brandCode1?: number;

	@Column({ nullable: true })
	brandCode2?: string;

	@Column({ type: Date })
	queryCreated: Date;

	@Column({ type: 'varchar', length: 6 })
	queryCode: string;
	@Column()
	state: number;

	@ManyToMany(
		type => Member,
		(member: Member) => member.works,
		{ cascadeInsert: true, cascadeUpdate: true })
	@JoinTable()
	repairers?: Member[];

	@CreateDateColumn()
	createAt?: Date;

	static From(other: Issue) {
		return new Issue(
			other.name,
			other.phone, other.type,
			other.password, other.brandCode1,
			other.brandCode2, other.describe);
	}

	constructor(
		name: string, phone: number,
		type: 'computer' | 'electric', password?: string,
		brandCode1?: number, brandCode2?: string, describe?: string) {
		this.name = name;
		this.phone = phone;
		this.type = type;
		this.teardown = false;
		this.password = password;
		this.brandCode1 = brandCode1;
		this.brandCode2 = brandCode2;
		this.describe = describe;
		this.queryCreated = new Date();
		this.queryCode = genRandomString({ length: 8, charset: 'numeric' });
		this.state = 0;

	}
}