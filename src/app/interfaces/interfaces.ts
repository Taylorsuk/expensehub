export interface ExpenseImage {
  base64?: string;
}

export interface ExpenseSaveData {
  id: string;
  amount: number | string;
  images: string[];
  description?: string;
  expenseDate: string;
  timeStamp: string;
  claimed: boolean;
}
