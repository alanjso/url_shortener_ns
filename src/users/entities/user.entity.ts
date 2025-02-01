import { Table, Column, Model, DataType, BeforeCreate } from 'sequelize-typescript';
import { Exclude } from 'class-transformer';
import * as bcrypt from 'bcrypt';

@Table({ tableName: 'users', timestamps: true })
export class User extends Model<User> {
    @Column({
        type: DataType.UUID,
        defaultValue: DataType.UUIDV4,
        primaryKey: true,
    })
    id: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        unique: true,
    })
    email: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    name: string;

    @Exclude()
    @Column({
        type: DataType.STRING,
        allowNull: false,
    })
    password: string;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    createdAt: Date;

    @Column({
        type: DataType.DATE,
        allowNull: false,
    })
    updatedAt: Date;

    @BeforeCreate
    static async hashPassword(user: User) {
        user.password = await bcrypt.hash(user.password, 10);
    }

    public async checkPassword(password: string): Promise<boolean> {
        return bcrypt.compare(password, this.password);
    }

}