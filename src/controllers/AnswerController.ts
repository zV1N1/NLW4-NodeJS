import { Request, Response } from "express"
import { getCustomRepository } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUserRepository";
import { AppError } from "../errors/AppError";

class AnswerController {
    /**
     * 
        Route Params => Parametros que compôe a rota
        router.get("/answers/:value")

        Query Params => Busca, Paginação, não obrigatorios
        ?
        chave=valor
     */

     async execute(request: Request, response: Response) {
         const { value } = request.params;
         const { u } = request.query;

         const surveysUsersRepository = getCustomRepository(SurveysUsersRepository)

         const surveyUser = await surveysUsersRepository.findOne({
             id: String(u)
         })

         surveyUser.value = Number(value)

         if(!surveyUser) {
             throw new AppError("Survey User does not exists", 400)
         }

         await surveysUsersRepository.save(surveyUser)

         return response.json(surveyUser)
     }
}

export { AnswerController }

