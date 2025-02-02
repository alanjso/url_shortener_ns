import { Table, Column, Model, DataType, Default, PrimaryKey, AutoIncrement, CreatedAt, UpdatedAt, DeletedAt, AllowNull, ForeignKey } from 'sequelize-typescript';
import { customAlphabet } from 'nanoid';
import { User } from '../../users/entities/user.entity';

const nano = customAlphabet(process.env.CUSTOM_ALPHABET || '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', 6);

@Table({
    tableName: 'urls',
    timestamps: true,
    paranoid: true,
})
export class Url extends Model<Url> {

    @PrimaryKey
    @AutoIncrement
    @Column(DataType.INTEGER)
    id: number;

    @AllowNull(false)
    @Column(DataType.STRING)
    originalUrl: string;

    @AllowNull(false)
    @Default(() => nano())
    @Column(DataType.STRING(6))
    shortUrl: string;

    @AllowNull(false)
    @Default(0)
    @Column(DataType.INTEGER)
    accessCount: number;

    @ForeignKey(() => User)
    @AllowNull(true)
    @Column(DataType.INTEGER)
    userId?: number;

    @AllowNull(false)
    @Default(true)
    @Column(DataType.BOOLEAN)
    isActive: boolean;

    @CreatedAt
    createdAt: Date;

    @UpdatedAt
    updatedAt: Date;

    @DeletedAt
    deletedAt?: Date | null;
}
