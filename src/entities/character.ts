/* eslint-disable- */
/* eslint-disable no-use-before-define */
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id!: string

  @Column({ type: 'text' })
  firstRame223333!: string

  @Column({ type: 'text' })
  last2Name333!: string

  @Column({ type: 'text' })
  country!: string

  @CreateDateColumn()
  created!: Date

  @UpdateDateColumn()
  updated!: Date
}
