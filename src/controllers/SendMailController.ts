import { UserRepository } from "../repositories/UserRepository"
import { SurveysRepository } from "../repositories/SurveysRepository"
import { SurveysUsersRepository } from "../repositories/SurveysUserRepository"
import { getCustomRepository } from "typeorm"
import { Request, Response } from "express"
import SendMailService from "../services/SendMailService"
import { resolve } from 'path'
import { AppError } from "../errors/AppError"

class SendMailController {
    async execute(request: Request, response: Response) {
        
        const { email, survey_id} = request.body

        const usersRepository = getCustomRepository(UserRepository)
        const surveysRepository = getCustomRepository(SurveysRepository)
        const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

        // retorna o usuario correspondente com o email na requisição
        const user = await usersRepository.findOne({ email })

        if (!user) { // se o usuario não existir
            throw new AppError("User does not exists", 400)
        }
        // retorna a survey que corresponde com o id requisitado
        const survey = await surveysRepository.findOne({id: survey_id})

        if(!survey) { //  retorna se a survey existir
            throw new AppError("Survey does not exists", 400)
        }

        // caminho com path
        const npsPath = resolve(__dirname, "..", "views", 'emails', "npsMail.hbs")

        const surveyUserAlreadyExists = await surveysUsersRepository.findOne({
            where: { user_id: user.id, value: null},
            relations: ["user", "survey"]
        })

        // variaveis para o enviar o email
        const variables = {
            name: user.name,
            title: survey.title,
            description: survey.description,
            user_id: user.id,
            id: "",
            link: process.env.URL_MAIL
        }

        if(surveyUserAlreadyExists) {
            variables.id = surveyUserAlreadyExists.id
            await SendMailService.execute(email, survey.title, variables, npsPath)
            return response.json(surveyUserAlreadyExists)
        }

        // Salvar as informações na tabela surveyUser
        const surveyUser = surveysUsersRepository.create({
            user_id: user.id,
            survey_id,
        })
        await surveysUsersRepository.save(surveyUser)
        variables.id = surveyUser.id

        // Enviar e-mail para o usuario
        await SendMailService.execute(email, survey.title, variables, npsPath)

        return response.json(surveyUser)
    }
}



export { SendMailController }
