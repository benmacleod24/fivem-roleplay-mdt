-- AlterTable
ALTER TABLE `_fivem_account_transactions` MODIFY `date` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `_fivem_phones_conversations` MODIFY `last_message` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `_fivem_phones_messages` MODIFY `message_timestamp` TIMESTAMP(0) DEFAULT CURRENT_TIMESTAMP(0);
