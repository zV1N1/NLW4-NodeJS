import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class CreateSurveysUsers1614891217787 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "surveys_users",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                    },
                    {
                        name: "user_id",
                        type: "uuid"
                    },
                    {
                        name: "survey_id",
                        type: "uuid"
                    },
                    {
                        name: "value",
                        type: "number",
                        isNullable: true,
                    },
                    {
                        name: "create_at",
                        type: "timestamp",
                        default: "now()"
                    },
                ],
                // definindo as chaves estrageiras
                foreignKeys: [
                    { 
                        name: "FKUser", // O nome
                        referencedTableName: "users", // nome ta tabela
                        referencedColumnNames: ['id'], // O nome da coluna
                        columnNames: ["user_id"], // qual campo vai ser colocando as informations
                        onDelete: "CASCADE", // 
                        onUpdate: "CASCADE",
                    },
                    { 
                        name: "FKSurvey", // O nome
                        referencedTableName: "surveys", // nome ta tabela
                        referencedColumnNames: ['id'], // O nome da coluna
                        columnNames: ["survey_id"], // qual campo vai ser colocando as informations
                        onDelete: "CASCADE", // 
                        onUpdate: "CASCADE",
                    },
                ]
            })
        )
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable("surveys_users")
    }

}