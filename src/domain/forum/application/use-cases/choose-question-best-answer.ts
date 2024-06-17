import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository';
import { Question } from '../../enterprise/entities/question';
import { QuestionsRepository } from '../repositories/questions-repository';

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

interface ChooseQuestionBestAnswerUseCaseResponse {
  question: Question;
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private answerRepository: AnswersRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findByID(answerId);

    if (!answer) {
      throw new Error('Answer not found');
    }

    const question = await this.questionsRepository.findByID(
      answer.questionId.toString(),
    );

    if (!question) {
      throw new Error('Question not found');
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Not allowed');
    }

    question.bestAnswerId = answer.id;

    await this.questionsRepository.save(question);

    return {
      question,
    };
  }
}
