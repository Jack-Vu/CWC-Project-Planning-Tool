import { Project } from 'src/projects/entities/project.entity';
import { UserStory } from 'src/userStories/entities/userStory.entity';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Feature {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Project, (project) => project.features, {
    onDelete: 'CASCADE',
  })
  project: Project;

  @OneToMany(() => UserStory, (userStory) => userStory.feature)
  userStories: UserStory[];

  @Column()
  name: string;

  @Column({ nullable: true })
  description?: string;
}
