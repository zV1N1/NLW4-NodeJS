import request from "supertest"
import { app } from "../app"

import createConnection from '../database'

describe("Users", () => {
    beforeAll(async () => {
        await createConnection()
        // await connection.runMigrations()
    })

    // "posttest": "rm ./src/database/database.test.sqlite"
    it("Should be able to create a new user", async () => {
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        }) 
        expect(response.status).not.toBe(201)
    })

    it("Should not be able to create a user with exists email", async () => { 
        const response = await request(app).post("/users").send({
            email: "user@example.com",
            name: "User Example"
        }) 
        expect(response.status).toBe(400)
    })
})