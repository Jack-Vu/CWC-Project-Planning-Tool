import { UserStory } from 'src/userStories/entities/userStory.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserStory, (userStories) => userStories.tasks)
  userStory: UserStory;

  @Column()
  name: string;

  @Column({ default: 'To Do' })
  status: string;
}
