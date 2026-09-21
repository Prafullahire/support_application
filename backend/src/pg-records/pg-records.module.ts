import { Module } from '@nestjs/common';
import { PgRecordsService } from './pg-records.service';
import { PgRecordsController } from './pg-records.controller';

@Module({
  controllers: [PgRecordsController],
  providers: [PgRecordsService],
  exports: [PgRecordsService],
})
export class PgRecordsModule {}
