import { Inject, Injectable } from "@nestjs/common";
import { IClientRepository } from "../../application/interfaces/reposoitories/iclient-repository";
import { ILoggerService } from "../../application/services/ilogger.service";
import { ClientEntity } from "../../domain/entities/client.entity";

@Injectable()
export class DbSeeder {
    constructor(
        @Inject("IUserRepository")
        private readonly clientRepository: IClientRepository, 
        @Inject("ILoggerService")
        private readonly logger: ILoggerService 
    ) {}

    async seed() {
        await this.createTestingUser("670d1451-5974-8002-9288-aa476cb08e01", "user1@example.com");
        await this.createTestingUser("670d1451-5974-8002-9288-aa476cb08e02", "user2@example.com");
    }

    private async createTestingUser(userId: string, email: string) {
        // TODO: add some restaurants and few users 
        const existingUser = await this.clientRepository.findOneByFilter({
            where: {
                email: email
            }
        });

        if (existingUser) {
            this.logger.info(`User with email ${email} already exists.`);
            return;
        }
        const newUser = new ClientEntity({
            email, 
            phone: "+55555555",
            age: 20,
            name: "User 1"
        });
        newUser.id = userId; 
        await this.clientRepository.saveNew(newUser);
        this.logger.info(`User ${email} created successfully.`);
    }
}
