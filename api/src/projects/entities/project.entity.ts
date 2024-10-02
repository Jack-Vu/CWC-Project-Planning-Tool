import { Feature } from 'src/features/entities/feature.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Project {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.project)
  user: User;

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;

  @Column({ default: 'To Do' })
  status: string;

  @OneToMany(() => Feature, (feature) => feature.project)
  features: Feature[];
}
