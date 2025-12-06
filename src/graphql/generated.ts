import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: { input: string; output: string; }
  /** Sort order */
  SortOrder: { input: any; output: any; }
  /** A field whose value is a generic Universally Unique Identifier: https://en.wikipedia.org/wiki/Universally_unique_identifier. */
  UUID: { input: string; output: string; }
};

/** Входные данные для создания счета */
export type AccountCreateInput = {
  /** Номер счета в банке */
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  /** Начальный баланс счета */
  balance?: InputMaybe<Scalars['Float']['input']>;
  /** Тип банка */
  bankType?: InputMaybe<BankType>;
  /** Bearer токен для доступа к API банка */
  bearerToken?: InputMaybe<Scalars['String']['input']>;
  /** Является ли счетом по умолчанию */
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  /** Название счета */
  name: Scalars['String']['input'];
  /** Тип счета */
  type: AccountType;
};

/** Счет пользователя */
export type AccountEntity = {
  __typename?: 'AccountEntity';
  /** Номер счета в банке */
  accountNumber?: Maybe<Scalars['String']['output']>;
  /** Баланс счета */
  balance: Scalars['Float']['output'];
  /** Тип банка */
  bankType?: Maybe<BankType>;
  /** Дата создания */
  createdAt: Scalars['DateTime']['output'];
  /** Уникальный идентификатор */
  id: Scalars['ID']['output'];
  /** Является ли счетом по умолчанию */
  isDefault: Scalars['Boolean']['output'];
  /** Название счета */
  name: Scalars['String']['output'];
  /** Транзакции по счету */
  transactions?: Maybe<Array<TransactionEntity>>;
  /** Тип счета */
  type: AccountType;
  /** Дата обновления */
  updatedAt: Scalars['DateTime']['output'];
  /** Пользователь-владелец */
  user: UserEntity;
  /** Идентификатор пользователя */
  userId: Scalars['ID']['output'];
};

/** Тип счета: CURRENT - текущий счет для повседневных операций, SAVINGS - накопительный счет, CREDIT - кредитный счет, INVESTMENT - инвестиционный счет, DEPOSIT - депозитный счет, BUSINESS - бизнес-счет */
export enum AccountType {
  Business = 'BUSINESS',
  Credit = 'CREDIT',
  Current = 'CURRENT',
  Deposit = 'DEPOSIT',
  Investment = 'INVESTMENT',
  Savings = 'SAVINGS'
}

/** Входные данные для обновления счета */
export type AccountUpdateInput = {
  /** Номер счета в банке */
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  /** Тип банка */
  bankType?: InputMaybe<BankType>;
  /** Bearer токен для доступа к API банка */
  bearerToken?: InputMaybe<Scalars['String']['input']>;
  /** Является ли счетом по умолчанию */
  isDefault?: InputMaybe<Scalars['Boolean']['input']>;
  /** Название счета */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Тип счета */
  type?: InputMaybe<AccountType>;
};

/** Фильтры для получения списка аналитики */
export type AnalyticsFilterInput = {
  /** Идентификатор счета */
  accountId?: InputMaybe<Scalars['String']['input']>;
  /** Дата начала периода */
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  /** Дата окончания периода */
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  /** Статус задачи */
  status?: InputMaybe<AnalyticsStatus>;
  /** Тип аналитики */
  type?: InputMaybe<AnalyticsType>;
};

/** Входные данные для запроса финансовой аналитики */
export type AnalyticsRequestInput = {
  /** Идентификатор счета (null для всех счетов) */
  accountId?: InputMaybe<Scalars['String']['input']>;
  /** Комментарий пользователя для аналитики */
  comment?: InputMaybe<Scalars['String']['input']>;
  /** Дата начала периода (если не указана, берется весь период) */
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  /** Дата окончания периода (если не указана, берется весь период) */
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  /** Тип аналитики */
  type: AnalyticsType;
};

/** Статус задачи аналитики */
export enum AnalyticsStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

/** Задача финансовой аналитики */
export type AnalyticsTaskEntity = {
  __typename?: 'AnalyticsTaskEntity';
  /** Счет для аналитики */
  account?: Maybe<AccountEntity>;
  /** Идентификатор счета (null для всех счетов) */
  accountId?: Maybe<Scalars['ID']['output']>;
  /** Комментарий пользователя */
  comment?: Maybe<Scalars['String']['output']>;
  /** Дата создания */
  createdAt: Scalars['DateTime']['output'];
  /** Дата начала периода */
  dateFrom?: Maybe<Scalars['DateTime']['output']>;
  /** Дата окончания периода */
  dateTo?: Maybe<Scalars['DateTime']['output']>;
  /** Ошибка при обработке */
  error?: Maybe<Scalars['String']['output']>;
  /** Уникальный идентификатор задачи */
  id: Scalars['ID']['output'];
  /** Результат аналитики (JSON) */
  result?: Maybe<Scalars['String']['output']>;
  /** Статус задачи */
  status: AnalyticsStatus;
  /** Тип аналитики */
  type: AnalyticsType;
  /** Дата обновления */
  updatedAt: Scalars['DateTime']['output'];
  /** Пользователь-владелец */
  user: UserEntity;
  /** Идентификатор пользователя */
  userId: Scalars['ID']['output'];
};

/** Тип финансовой аналитики */
export enum AnalyticsType {
  BudgetCompliance = 'BUDGET_COMPLIANCE',
  CategoryBreakdown = 'CATEGORY_BREAKDOWN',
  IncomeAnalysis = 'INCOME_ANALYSIS',
  SpendingPatterns = 'SPENDING_PATTERNS',
  TrendAnalysis = 'TREND_ANALYSIS'
}

/** Тип банка */
export enum BankType {
  AlfaBank = 'ALFA_BANK',
  CenterBank = 'CENTER_BANK',
  Invest = 'INVEST',
  Sberbank = 'SBERBANK',
  Tbank = 'TBANK'
}

/** Категория бюджета: ENTERTAINMENT - Развлечения, CINEMA - Кино, RESTAURANTS - Рестораны, TRANSPORT - Транспорт, GROCERIES - Продукты, CLOTHING - Одежда, HEALTH - Здоровье, EDUCATION - Образование, UTILITIES - Коммунальные услуги, INTERNET - Интернет, MOBILE - Мобильная связь, TECH - Техника, GIFTS - Подарки, TRAVEL - Путешествия, SPORTS - Спорт, BOOKS - Книги, BEAUTY - Красота, HOME - Дом, PETS - Домашние животные, OTHER - Другое */
export enum BudgetCategory {
  Beauty = 'BEAUTY',
  Books = 'BOOKS',
  Cinema = 'CINEMA',
  Clothing = 'CLOTHING',
  Education = 'EDUCATION',
  Entertainment = 'ENTERTAINMENT',
  Gifts = 'GIFTS',
  Groceries = 'GROCERIES',
  Health = 'HEALTH',
  Home = 'HOME',
  Internet = 'INTERNET',
  Mobile = 'MOBILE',
  Other = 'OTHER',
  Pets = 'PETS',
  Restaurants = 'RESTAURANTS',
  Sports = 'SPORTS',
  Tech = 'TECH',
  Transport = 'TRANSPORT',
  Travel = 'TRAVEL',
  Utilities = 'UTILITIES'
}

/** Входные данные для создания бюджета */
export type BudgetCreateInput = {
  /** Категория бюджета */
  category: BudgetCategory;
  /** Текущая потраченная сумма */
  currentAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Название бюджета */
  name: Scalars['String']['input'];
  /** Целевая сумма бюджета */
  targetAmount: Scalars['Float']['input'];
  /** Тип бюджета */
  type: BudgetType;
};

/** Бюджет пользователя */
export type BudgetEntity = {
  __typename?: 'BudgetEntity';
  /** Категория бюджета */
  category: BudgetCategory;
  /** Дата создания */
  createdAt: Scalars['DateTime']['output'];
  /** Текущая потраченная сумма */
  currentAmount: Scalars['Float']['output'];
  /** Уникальный идентификатор */
  id: Scalars['ID']['output'];
  /** Дата последнего отправленного уведомления */
  lastAlertSent?: Maybe<Scalars['DateTime']['output']>;
  /** Название бюджета */
  name: Scalars['String']['output'];
  /** Целевая сумма бюджета */
  targetAmount: Scalars['Float']['output'];
  /** Тип бюджета */
  type: BudgetType;
  /** Дата обновления */
  updatedAt: Scalars['DateTime']['output'];
  /** Пользователь-владелец */
  user: UserEntity;
  /** Идентификатор пользователя */
  userId: Scalars['ID']['output'];
};

/** Тип бюджета: MONTHLY - Месячный, WEEKLY - Недельный, YEARLY - Годовой, CUSTOM - Произвольный */
export enum BudgetType {
  Custom = 'CUSTOM',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

/** Входные данные для обновления бюджета */
export type BudgetUpdateInput = {
  /** Категория бюджета */
  category?: InputMaybe<BudgetCategory>;
  /** Текущая потраченная сумма */
  currentAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Название бюджета */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Целевая сумма бюджета */
  targetAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Тип бюджета */
  type?: InputMaybe<BudgetType>;
};

/** Входные данные для создания сообщения чата */
export type ChatMessageCreateInput = {
  /** Сообщение пользователя */
  message: Scalars['String']['input'];
};

/** Сообщение чата с финансовым ботом */
export type ChatMessageEntity = {
  __typename?: 'ChatMessageEntity';
  /** Ответ от нейросети */
  aiResponse?: Maybe<Scalars['String']['output']>;
  /** Дата создания */
  createdAt: Scalars['DateTime']['output'];
  /** Ошибка обработки */
  error?: Maybe<Scalars['String']['output']>;
  /** Уникальный идентификатор */
  id: Scalars['ID']['output'];
  /** Статус обработки сообщения */
  status: ChatMessageStatus;
  /** Дата обновления */
  updatedAt: Scalars['DateTime']['output'];
  /** Пользователь-отправитель */
  user: UserEntity;
  /** Идентификатор пользователя */
  userId: Scalars['ID']['output'];
  /** Сообщение пользователя */
  userMessage: Scalars['String']['output'];
};

/** Статус сообщения чата */
export enum ChatMessageStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING',
  Processing = 'PROCESSING'
}

/** Входные данные для подтверждения адреса электронной почты */
export type ConfirmEmailInput = {
  /** Токен подтверждения, отправленный на электронную почту */
  token: Scalars['String']['input'];
};

export type ImageEntity = {
  __typename?: 'ImageEntity';
  avatarUrl: Scalars['String']['output'];
  /** Check sum of file content */
  checksum?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  /** File description if needed */
  description?: Maybe<Scalars['String']['output']>;
  downloadUrl: Scalars['String']['output'];
  /** File extension with dot: ".jpg", ".png", ".pdf", etc */
  ext: Scalars['String']['output'];
  /** Image height in pixels after resizing */
  height?: Maybe<Scalars['Int']['output']>;
  id: Scalars['ID']['output'];
  /** Is image visible to users */
  isVisible?: Maybe<Scalars['Boolean']['output']>;
  /** Original file name with extension: "image.jpg", "document.pdf", etc */
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  url: Scalars['String']['output'];
  /** Image width in pixels after resizing */
  width?: Maybe<Scalars['Int']['output']>;
};

export type ImageStoreUpdateInput = {
  id: Scalars['UUID']['input'];
  /** is the image visible to the public */
  isVisible: Scalars['Boolean']['input'];
};

/** Входные данные для авторизации пользователя */
export type LoginInput = {
  /** Адрес электронной почты пользователя */
  email: Scalars['String']['input'];
  /** Пароль пользователя */
  password: Scalars['String']['input'];
};

export type Mutation = {
  __typename?: 'Mutation';
  /** Изменение пароля */
  changePassword: UserEntity;
  /** Подтверждение адреса электронной почты по токену, отправленному на email */
  confirmEmail: UserEntity;
  /** Создание нового счета */
  createAccount: AccountEntity;
  /** Создание задачи финансовой аналитики */
  createAnalytics: AnalyticsTaskEntity;
  /** Создание нового бюджета */
  createBudget: BudgetEntity;
  /** Создание новой транзакции */
  createTransaction: TransactionEntity;
  /** Удаление счета */
  deleteAccount: AccountEntity;
  /** Удаление бюджета */
  deleteBudget: BudgetEntity;
  /** Удаление профиля пользователя */
  deleteProfile: UserEntity;
  /** Удаление транзакции */
  deleteTransaction: TransactionEntity;
  /** Авторизация пользователя. Возвращает пользователя с установленным JWT токеном. */
  login: UserEntity;
  /** Повторная обработка задачи аналитики */
  refreshAnalytics: AnalyticsTaskEntity;
  /** Регистрация пользователя. Требует подтверждения email. */
  register: UserEntity;
  /** Отправка сообщения в финансовый чат-бот */
  sendMessage: ChatMessageEntity;
  /** Установка счета по умолчанию */
  setDefaultAccount: AccountEntity;
  /** Синхронизация всех счетов Т-Банка пользователя */
  syncAllTBankAccounts: SyncResult;
  /** Синхронизация транзакций для конкретного счета Т-Банка */
  syncTBankAccount: Scalars['Float']['output'];
  /** Обновление счета */
  updateAccount: AccountEntity;
  /** Обновление бюджета */
  updateBudget: BudgetEntity;
  /** Updates the image store in the database (specifically isVisible) */
  updateImageStore: ImageEntity;
  /** Обновление профиля пользователя */
  updateProfile: UserEntity;
  /** Обновление транзакции */
  updateTransaction: TransactionEntity;
};


export type MutationChangePasswordArgs = {
  input: PasswordChangeInput;
};


export type MutationConfirmEmailArgs = {
  input: ConfirmEmailInput;
};


export type MutationCreateAccountArgs = {
  input: AccountCreateInput;
};


export type MutationCreateAnalyticsArgs = {
  input: AnalyticsRequestInput;
};


export type MutationCreateBudgetArgs = {
  input: BudgetCreateInput;
};


export type MutationCreateTransactionArgs = {
  input: TransactionCreateInput;
};


export type MutationDeleteAccountArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteBudgetArgs = {
  id: Scalars['String']['input'];
};


export type MutationDeleteTransactionArgs = {
  id: Scalars['String']['input'];
};


export type MutationLoginArgs = {
  input: LoginInput;
};


export type MutationRefreshAnalyticsArgs = {
  id: Scalars['String']['input'];
};


export type MutationRegisterArgs = {
  input: RegisterInput;
};


export type MutationSendMessageArgs = {
  input: ChatMessageCreateInput;
};


export type MutationSetDefaultAccountArgs = {
  id: Scalars['String']['input'];
};


export type MutationSyncTBankAccountArgs = {
  accountId: Scalars['String']['input'];
};


export type MutationUpdateAccountArgs = {
  id: Scalars['String']['input'];
  input: AccountUpdateInput;
};


export type MutationUpdateBudgetArgs = {
  id: Scalars['String']['input'];
  input: BudgetUpdateInput;
};


export type MutationUpdateImageStoreArgs = {
  input: ImageStoreUpdateInput;
};


export type MutationUpdateProfileArgs = {
  input: UserUpdateInput;
};


export type MutationUpdateTransactionArgs = {
  id: Scalars['String']['input'];
  input: TransactionUpdateInput;
};

/** Пагинированный список транзакций */
export type PaginatedTransactionResponse = {
  __typename?: 'PaginatedTransactionResponse';
  /** Список транзакций */
  data: Array<TransactionEntity>;
  /** Records count with filter without pagination */
  queryCount: Scalars['Int']['output'];
  /** Records count without filter and pagination */
  totalCount: Scalars['Int']['output'];
};

/** Входные данные для изменения пароля */
export type PasswordChangeInput = {
  /** Текущий пароль */
  currentPassword: Scalars['String']['input'];
  /** Новый пароль */
  newPassword: Scalars['String']['input'];
};

export type Query = {
  __typename?: 'Query';
  /** Получение счета по идентификатору */
  account: AccountEntity;
  /** Получение всех счетов пользователя */
  accounts: Array<AccountEntity>;
  /** Получение активных задач аналитики (в процессе обработки) */
  activeAnalyticsJobs: Array<AnalyticsTaskEntity>;
  /** Получение задачи аналитики по идентификатору */
  analyticsTask: AnalyticsTaskEntity;
  /** Получение всех задач аналитики с фильтрами */
  analyticsTasks: Array<AnalyticsTaskEntity>;
  /** Получение бюджета по идентификатору */
  budget: BudgetEntity;
  /** Получение всех бюджетов пользователя */
  budgets: Array<BudgetEntity>;
  /** Получение информации о текущем авторизованном пользователе */
  getCurrentUser: UserEntity;
  /** Получение статуса сообщения */
  getMessageStatus: ChatMessageEntity;
  healthCheck: Scalars['String']['output'];
  /** Получение текущего пользователя */
  me: UserEntity;
  /** Получение транзакции по идентификатору */
  transaction: TransactionEntity;
  /** Получение всех транзакций пользователя */
  transactions: Array<TransactionEntity>;
  /** Получение транзакций по счету */
  transactionsByAccount: Array<TransactionEntity>;
  /** Получение транзакций с фильтрами, сортировкой и пагинацией */
  transactionsList: PaginatedTransactionResponse;
};


export type QueryAccountArgs = {
  id: Scalars['String']['input'];
};


export type QueryAnalyticsTaskArgs = {
  id: Scalars['String']['input'];
};


export type QueryAnalyticsTasksArgs = {
  filter?: InputMaybe<AnalyticsFilterInput>;
};


export type QueryBudgetArgs = {
  id: Scalars['String']['input'];
};


export type QueryGetMessageStatusArgs = {
  messageId: Scalars['String']['input'];
};


export type QueryTransactionArgs = {
  id: Scalars['String']['input'];
};


export type QueryTransactionsByAccountArgs = {
  accountId: Scalars['String']['input'];
};


export type QueryTransactionsListArgs = {
  input?: InputMaybe<TransactionListInput>;
};

/** Интервал повторения транзакции */
export enum RecurringInterval {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

/** Входные данные для регистрации пользователя */
export type RegisterInput = {
  /** Адрес электронной почты пользователя */
  email: Scalars['String']['input'];
  /** Имя пользователя */
  name?: InputMaybe<Scalars['String']['input']>;
  /** Пароль пользователя */
  password: Scalars['String']['input'];
};

/** Результат синхронизации счетов */
export type SyncResult = {
  __typename?: 'SyncResult';
  /** Количество синхронизированных счетов */
  accountsSynced: Scalars['Float']['output'];
  /** Общее количество синхронизированных транзакций */
  totalTransactions: Scalars['Float']['output'];
};

/** Входные данные для создания транзакции */
export type TransactionCreateInput = {
  /** Идентификатор счета */
  accountId: Scalars['String']['input'];
  /** Сумма транзакции */
  amount: Scalars['Float']['input'];
  /** Категория транзакции */
  category: Scalars['String']['input'];
  /** Дата транзакции */
  date: Scalars['DateTime']['input'];
  /** Описание транзакции */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Является ли повторяющейся */
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  /** URL чека */
  receiptUrl?: InputMaybe<Scalars['String']['input']>;
  /** Интервал повторения */
  recurringInterval?: InputMaybe<RecurringInterval>;
  /** Статус транзакции */
  status?: InputMaybe<TransactionStatus>;
  /** Тип транзакции */
  type: TransactionType;
};

/** Транзакция пользователя */
export type TransactionEntity = {
  __typename?: 'TransactionEntity';
  /** Счет транзакции */
  account: AccountEntity;
  /** Идентификатор счета */
  accountId: Scalars['ID']['output'];
  /** Сумма транзакции */
  amount: Scalars['Float']['output'];
  /** Категория транзакции */
  category: Scalars['String']['output'];
  /** Дата создания */
  createdAt: Scalars['DateTime']['output'];
  /** Дата транзакции */
  date: Scalars['DateTime']['output'];
  /** Описание транзакции */
  description?: Maybe<Scalars['String']['output']>;
  /** Уникальный идентификатор */
  id: Scalars['ID']['output'];
  /** Является ли повторяющейся */
  isRecurring: Scalars['Boolean']['output'];
  /** Последняя обработка повторяющейся транзакции */
  lastProcessed?: Maybe<Scalars['DateTime']['output']>;
  /** Следующая дата повторения */
  nextRecurringDate?: Maybe<Scalars['DateTime']['output']>;
  /** URL чека */
  receiptUrl?: Maybe<Scalars['String']['output']>;
  /** Интервал повторения */
  recurringInterval?: Maybe<RecurringInterval>;
  /** Статус транзакции */
  status: TransactionStatus;
  /** Тип транзакции */
  type: TransactionType;
  /** Дата обновления */
  updatedAt: Scalars['DateTime']['output'];
  /** Пользователь-владелец */
  user: UserEntity;
  /** Идентификатор пользователя */
  userId: Scalars['ID']['output'];
};

/** Входные данные для получения списка транзакций с фильтрами, сортировкой и пагинацией */
export type TransactionListInput = {
  /** Идентификатор счета */
  accountId?: InputMaybe<Scalars['String']['input']>;
  /** Категория транзакции */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Дата начала периода */
  dateFrom?: InputMaybe<Scalars['DateTime']['input']>;
  /** Дата окончания периода */
  dateTo?: InputMaybe<Scalars['DateTime']['input']>;
  /** Максимальная сумма транзакции */
  maxAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Минимальная сумма транзакции */
  minAmount?: InputMaybe<Scalars['Float']['input']>;
  /** Поиск по описанию */
  search?: InputMaybe<Scalars['String']['input']>;
  skip?: InputMaybe<Scalars['Int']['input']>;
  sort?: InputMaybe<Scalars['SortOrder']['input']>;
  /** Статус транзакции */
  status?: InputMaybe<TransactionStatus>;
  take?: InputMaybe<Scalars['Int']['input']>;
  /** Тип транзакции */
  type?: InputMaybe<TransactionType>;
};

/** Статус транзакции */
export enum TransactionStatus {
  Completed = 'COMPLETED',
  Failed = 'FAILED',
  Pending = 'PENDING'
}

/** Тип транзакции */
export enum TransactionType {
  Expense = 'EXPENSE',
  Income = 'INCOME'
}

/** Входные данные для обновления транзакции */
export type TransactionUpdateInput = {
  /** Идентификатор счета */
  accountId?: InputMaybe<Scalars['String']['input']>;
  /** Сумма транзакции */
  amount?: InputMaybe<Scalars['Float']['input']>;
  /** Категория транзакции */
  category?: InputMaybe<Scalars['String']['input']>;
  /** Дата транзакции */
  date?: InputMaybe<Scalars['DateTime']['input']>;
  /** Описание транзакции */
  description?: InputMaybe<Scalars['String']['input']>;
  /** Является ли повторяющейся */
  isRecurring?: InputMaybe<Scalars['Boolean']['input']>;
  /** URL чека */
  receiptUrl?: InputMaybe<Scalars['String']['input']>;
  /** Интервал повторения */
  recurringInterval?: InputMaybe<RecurringInterval>;
  /** Статус транзакции */
  status?: InputMaybe<TransactionStatus>;
  /** Тип транзакции */
  type?: InputMaybe<TransactionType>;
};

/** Пользователь системы */
export type UserEntity = {
  __typename?: 'UserEntity';
  /** Счета пользователя */
  accounts?: Maybe<Array<AccountEntity>>;
  /** Бюджеты пользователя */
  budgets?: Maybe<Array<BudgetEntity>>;
  /** Дата и время создания пользователя */
  createdAt: Scalars['DateTime']['output'];
  /** Адрес электронной почты пользователя */
  email: Scalars['String']['output'];
  /** Идентификатор пользователя */
  id: Scalars['ID']['output'];
  /** URL изображения профиля */
  imageUrl?: Maybe<Scalars['String']['output']>;
  /** Флаг активности пользователя */
  isActive: Scalars['Boolean']['output'];
  /** Флаг подтверждения адреса электронной почты */
  isEmailConfirmed: Scalars['Boolean']['output'];
  /** Текущий JWT токен пользователя для авторизации */
  jwtToken?: Maybe<Scalars['String']['output']>;
  /** Аватар пользователя */
  logo?: Maybe<ImageEntity>;
  /** Имя пользователя */
  name?: Maybe<Scalars['String']['output']>;
  /** Транзакции пользователя */
  transactions?: Maybe<Array<TransactionEntity>>;
  /** Дата и время последнего обновления пользователя */
  updatedAt: Scalars['DateTime']['output'];
};

/** Входные данные для обновления профиля пользователя */
export type UserUpdateInput = {
  /** URL изображения профиля */
  imageUrl?: InputMaybe<Scalars['String']['input']>;
  /** Имя пользователя */
  name?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAccountMutationVariables = Exact<{
  input: AccountCreateInput;
}>;


export type CreateAccountMutation = { __typename?: 'Mutation', createAccount: { __typename?: 'AccountEntity', id: string, name: string, type: AccountType, balance: number, isDefault: boolean, bankType?: BankType | null, accountNumber?: string | null, createdAt: string, updatedAt: string } };

export type UpdateAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: AccountUpdateInput;
}>;


export type UpdateAccountMutation = { __typename?: 'Mutation', updateAccount: { __typename?: 'AccountEntity', id: string, name: string, type: AccountType, balance: number, isDefault: boolean, bankType?: BankType | null, accountNumber?: string | null, updatedAt: string } };

export type DeleteAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteAccountMutation = { __typename?: 'Mutation', deleteAccount: { __typename?: 'AccountEntity', id: string, name: string } };

export type SetDefaultAccountMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type SetDefaultAccountMutation = { __typename?: 'Mutation', setDefaultAccount: { __typename?: 'AccountEntity', id: string, name: string, isDefault: boolean } };

export type CreateAnalyticsMutationVariables = Exact<{
  input: AnalyticsRequestInput;
}>;


export type CreateAnalyticsMutation = { __typename?: 'Mutation', createAnalytics: { __typename?: 'AnalyticsTaskEntity', id: string, type: AnalyticsType, status: AnalyticsStatus, accountId?: string | null, dateFrom?: string | null, dateTo?: string | null, comment?: string | null, createdAt: string, account?: { __typename?: 'AccountEntity', id: string, name: string } | null } };

export type RefreshAnalyticsMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type RefreshAnalyticsMutation = { __typename?: 'Mutation', refreshAnalytics: { __typename?: 'AnalyticsTaskEntity', id: string, status: AnalyticsStatus, updatedAt: string } };

export type RegisterMutationVariables = Exact<{
  input: RegisterInput;
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'UserEntity', id: string, email: string, name?: string | null, isEmailConfirmed: boolean, jwtToken?: string | null } };

export type LoginMutationVariables = Exact<{
  input: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'UserEntity', id: string, email: string, name?: string | null, imageUrl?: string | null, isActive: boolean, isEmailConfirmed: boolean, jwtToken?: string | null } };

export type ConfirmEmailMutationVariables = Exact<{
  input: ConfirmEmailInput;
}>;


export type ConfirmEmailMutation = { __typename?: 'Mutation', confirmEmail: { __typename?: 'UserEntity', id: string, email: string, isEmailConfirmed: boolean } };

export type CreateBudgetMutationVariables = Exact<{
  input: BudgetCreateInput;
}>;


export type CreateBudgetMutation = { __typename?: 'Mutation', createBudget: { __typename?: 'BudgetEntity', id: string, name: string, category: BudgetCategory, type: BudgetType, targetAmount: number, currentAmount: number, lastAlertSent?: string | null, userId: string, createdAt: string, updatedAt: string } };

export type UpdateBudgetMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: BudgetUpdateInput;
}>;


export type UpdateBudgetMutation = { __typename?: 'Mutation', updateBudget: { __typename?: 'BudgetEntity', id: string, name: string, category: BudgetCategory, type: BudgetType, targetAmount: number, currentAmount: number, lastAlertSent?: string | null, userId: string, updatedAt: string } };

export type DeleteBudgetMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteBudgetMutation = { __typename?: 'Mutation', deleteBudget: { __typename?: 'BudgetEntity', id: string, name: string, category: BudgetCategory, type: BudgetType, targetAmount: number } };

export type SendMessageMutationVariables = Exact<{
  input: ChatMessageCreateInput;
}>;


export type SendMessageMutation = { __typename?: 'Mutation', sendMessage: { __typename?: 'ChatMessageEntity', id: string, status: ChatMessageStatus, userMessage: string, aiResponse?: string | null, error?: string | null, userId: string, createdAt: string, updatedAt: string } };

export type UpdateImageStoreMutationVariables = Exact<{
  input: ImageStoreUpdateInput;
}>;


export type UpdateImageStoreMutation = { __typename?: 'Mutation', updateImageStore: { __typename?: 'ImageEntity', id: string, name: string, description?: string | null, ext: string, url: string, updatedAt: string, createdAt: string, width?: number | null, height?: number | null, downloadUrl: string, avatarUrl: string, isVisible?: boolean | null, checksum?: string | null } };

export type UpdateProfileMutationVariables = Exact<{
  input: UserUpdateInput;
}>;


export type UpdateProfileMutation = { __typename?: 'Mutation', updateProfile: { __typename?: 'UserEntity', id: string, email: string, name?: string | null, imageUrl?: string | null, isActive: boolean, isEmailConfirmed: boolean, createdAt: string, updatedAt: string, logo?: { __typename?: 'ImageEntity', id: string, url: string, avatarUrl: string } | null } };

export type ChangePasswordMutationVariables = Exact<{
  input: PasswordChangeInput;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', changePassword: { __typename?: 'UserEntity', id: string, email: string, name?: string | null, updatedAt: string } };

export type DeleteProfileMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteProfileMutation = { __typename?: 'Mutation', deleteProfile: { __typename?: 'UserEntity', id: string, email: string, name?: string | null } };

export type SyncTBankAccountMutationVariables = Exact<{
  accountId: Scalars['String']['input'];
}>;


export type SyncTBankAccountMutation = { __typename?: 'Mutation', syncTBankAccount: number };

export type SyncAllTBankAccountsMutationVariables = Exact<{ [key: string]: never; }>;


export type SyncAllTBankAccountsMutation = { __typename?: 'Mutation', syncAllTBankAccounts: { __typename?: 'SyncResult', accountsSynced: number, totalTransactions: number } };

export type CreateTransactionMutationVariables = Exact<{
  input: TransactionCreateInput;
}>;


export type CreateTransactionMutation = { __typename?: 'Mutation', createTransaction: { __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number, description?: string | null, date: string, category: string, receiptUrl?: string | null, isRecurring: boolean, recurringInterval?: RecurringInterval | null, status: TransactionStatus, accountId: string, createdAt: string, updatedAt: string } };

export type UpdateTransactionMutationVariables = Exact<{
  id: Scalars['String']['input'];
  input: TransactionUpdateInput;
}>;


export type UpdateTransactionMutation = { __typename?: 'Mutation', updateTransaction: { __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number, description?: string | null, date: string, category: string, receiptUrl?: string | null, isRecurring: boolean, recurringInterval?: RecurringInterval | null, status: TransactionStatus, updatedAt: string } };

export type DeleteTransactionMutationVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type DeleteTransactionMutation = { __typename?: 'Mutation', deleteTransaction: { __typename?: 'TransactionEntity', id: string, description?: string | null, amount: number } };

export type GetAccountsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAccountsQuery = { __typename?: 'Query', accounts: Array<{ __typename?: 'AccountEntity', id: string, name: string, type: AccountType, balance: number, isDefault: boolean, bankType?: BankType | null, accountNumber?: string | null, createdAt: string, updatedAt: string, transactions?: Array<{ __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number, date: string }> | null }> };

export type GetAccountQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetAccountQuery = { __typename?: 'Query', account: { __typename?: 'AccountEntity', id: string, name: string, type: AccountType, balance: number, isDefault: boolean, bankType?: BankType | null, accountNumber?: string | null, createdAt: string, updatedAt: string, transactions?: Array<{ __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number, description?: string | null, date: string, category: string, status: TransactionStatus }> | null } };

export type GetAnalyticsTaskQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetAnalyticsTaskQuery = { __typename?: 'Query', analyticsTask: { __typename?: 'AnalyticsTaskEntity', id: string, type: AnalyticsType, status: AnalyticsStatus, accountId?: string | null, dateFrom?: string | null, dateTo?: string | null, comment?: string | null, result?: string | null, error?: string | null, userId: string, createdAt: string, updatedAt: string, account?: { __typename?: 'AccountEntity', id: string, name: string } | null } };

export type GetAnalyticsTasksQueryVariables = Exact<{
  filter?: InputMaybe<AnalyticsFilterInput>;
}>;


export type GetAnalyticsTasksQuery = { __typename?: 'Query', analyticsTasks: Array<{ __typename?: 'AnalyticsTaskEntity', id: string, type: AnalyticsType, status: AnalyticsStatus, accountId?: string | null, dateFrom?: string | null, dateTo?: string | null, comment?: string | null, result?: string | null, error?: string | null, createdAt: string, updatedAt: string, account?: { __typename?: 'AccountEntity', id: string, name: string } | null }> };

export type GetActiveAnalyticsJobsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetActiveAnalyticsJobsQuery = { __typename?: 'Query', activeAnalyticsJobs: Array<{ __typename?: 'AnalyticsTaskEntity', id: string, type: AnalyticsType, status: AnalyticsStatus, accountId?: string | null, dateFrom?: string | null, dateTo?: string | null, comment?: string | null, createdAt: string, account?: { __typename?: 'AccountEntity', id: string, name: string } | null }> };

export type GetCurrentUserQueryVariables = Exact<{ [key: string]: never; }>;


export type GetCurrentUserQuery = { __typename?: 'Query', getCurrentUser: { __typename?: 'UserEntity', id: string, email: string, name?: string | null, imageUrl?: string | null, isActive: boolean, isEmailConfirmed: boolean, jwtToken?: string | null, createdAt: string, updatedAt: string, logo?: { __typename?: 'ImageEntity', id: string, url: string, avatarUrl: string } | null } };

export type GetBudgetsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetBudgetsQuery = { __typename?: 'Query', budgets: Array<{ __typename?: 'BudgetEntity', id: string, name: string, category: BudgetCategory, type: BudgetType, targetAmount: number, currentAmount: number, lastAlertSent?: string | null, userId: string, createdAt: string, updatedAt: string }> };

export type GetBudgetQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetBudgetQuery = { __typename?: 'Query', budget: { __typename?: 'BudgetEntity', id: string, name: string, category: BudgetCategory, type: BudgetType, targetAmount: number, currentAmount: number, lastAlertSent?: string | null, userId: string, createdAt: string, updatedAt: string } };

export type GetMessageStatusQueryVariables = Exact<{
  messageId: Scalars['String']['input'];
}>;


export type GetMessageStatusQuery = { __typename?: 'Query', getMessageStatus: { __typename?: 'ChatMessageEntity', id: string, status: ChatMessageStatus, userMessage: string, aiResponse?: string | null, error?: string | null, userId: string, createdAt: string, updatedAt: string } };

export type HealthCheckQueryVariables = Exact<{ [key: string]: never; }>;


export type HealthCheckQuery = { __typename?: 'Query', healthCheck: string };

export type GetTransactionsQueryVariables = Exact<{ [key: string]: never; }>;


export type GetTransactionsQuery = { __typename?: 'Query', transactions: Array<{ __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number, description?: string | null, date: string, category: string, receiptUrl?: string | null, isRecurring: boolean, recurringInterval?: RecurringInterval | null, nextRecurringDate?: string | null, status: TransactionStatus, accountId: string, createdAt: string, updatedAt: string, account: { __typename?: 'AccountEntity', id: string, name: string, bankType?: BankType | null } }> };

export type GetTransactionsByAccountQueryVariables = Exact<{
  accountId: Scalars['String']['input'];
}>;


export type GetTransactionsByAccountQuery = { __typename?: 'Query', transactionsByAccount: Array<{ __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number, description?: string | null, date: string, category: string, receiptUrl?: string | null, isRecurring: boolean, status: TransactionStatus, createdAt: string, updatedAt: string }> };

export type GetTransactionQueryVariables = Exact<{
  id: Scalars['String']['input'];
}>;


export type GetTransactionQuery = { __typename?: 'Query', transaction: { __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number, description?: string | null, date: string, category: string, receiptUrl?: string | null, isRecurring: boolean, recurringInterval?: RecurringInterval | null, nextRecurringDate?: string | null, lastProcessed?: string | null, status: TransactionStatus, accountId: string, createdAt: string, updatedAt: string, account: { __typename?: 'AccountEntity', id: string, name: string, type: AccountType, bankType?: BankType | null } } };

export type GetTransactionsListQueryVariables = Exact<{
  input?: InputMaybe<TransactionListInput>;
}>;


export type GetTransactionsListQuery = { __typename?: 'Query', transactionsList: { __typename?: 'PaginatedTransactionResponse', totalCount: number, data: Array<{ __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number, description?: string | null, date: string, category: string, receiptUrl?: string | null, isRecurring: boolean, recurringInterval?: RecurringInterval | null, nextRecurringDate?: string | null, lastProcessed?: string | null, status: TransactionStatus, accountId: string, createdAt: string, updatedAt: string, account: { __typename?: 'AccountEntity', id: string, name: string, type: AccountType, bankType?: BankType | null } }> } };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me: { __typename?: 'UserEntity', id: string, email: string, name?: string | null, imageUrl?: string | null, isActive: boolean, isEmailConfirmed: boolean, jwtToken?: string | null, createdAt: string, updatedAt: string, accounts?: Array<{ __typename?: 'AccountEntity', id: string, name: string, type: AccountType, balance: number }> | null, transactions?: Array<{ __typename?: 'TransactionEntity', id: string, type: TransactionType, amount: number }> | null, budgets?: Array<{ __typename?: 'BudgetEntity', id: string, name: string, category: BudgetCategory, type: BudgetType, targetAmount: number, currentAmount: number }> | null, logo?: { __typename?: 'ImageEntity', id: string, url: string, avatarUrl: string } | null } };


export const CreateAccountDocument = gql`
    mutation CreateAccount($input: AccountCreateInput!) {
  createAccount(input: $input) {
    id
    name
    type
    balance
    isDefault
    bankType
    accountNumber
    createdAt
    updatedAt
  }
}
    `;
export type CreateAccountMutationFn = Apollo.MutationFunction<CreateAccountMutation, CreateAccountMutationVariables>;

/**
 * __useCreateAccountMutation__
 *
 * To run a mutation, you first call `useCreateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAccountMutation, { data, loading, error }] = useCreateAccountMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAccountMutation(baseOptions?: Apollo.MutationHookOptions<CreateAccountMutation, CreateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAccountMutation, CreateAccountMutationVariables>(CreateAccountDocument, options);
      }
export type CreateAccountMutationHookResult = ReturnType<typeof useCreateAccountMutation>;
export type CreateAccountMutationResult = Apollo.MutationResult<CreateAccountMutation>;
export type CreateAccountMutationOptions = Apollo.BaseMutationOptions<CreateAccountMutation, CreateAccountMutationVariables>;
export const UpdateAccountDocument = gql`
    mutation UpdateAccount($id: String!, $input: AccountUpdateInput!) {
  updateAccount(id: $id, input: $input) {
    id
    name
    type
    balance
    isDefault
    bankType
    accountNumber
    updatedAt
  }
}
    `;
export type UpdateAccountMutationFn = Apollo.MutationFunction<UpdateAccountMutation, UpdateAccountMutationVariables>;

/**
 * __useUpdateAccountMutation__
 *
 * To run a mutation, you first call `useUpdateAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateAccountMutation, { data, loading, error }] = useUpdateAccountMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateAccountMutation(baseOptions?: Apollo.MutationHookOptions<UpdateAccountMutation, UpdateAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateAccountMutation, UpdateAccountMutationVariables>(UpdateAccountDocument, options);
      }
export type UpdateAccountMutationHookResult = ReturnType<typeof useUpdateAccountMutation>;
export type UpdateAccountMutationResult = Apollo.MutationResult<UpdateAccountMutation>;
export type UpdateAccountMutationOptions = Apollo.BaseMutationOptions<UpdateAccountMutation, UpdateAccountMutationVariables>;
export const DeleteAccountDocument = gql`
    mutation DeleteAccount($id: String!) {
  deleteAccount(id: $id) {
    id
    name
  }
}
    `;
export type DeleteAccountMutationFn = Apollo.MutationFunction<DeleteAccountMutation, DeleteAccountMutationVariables>;

/**
 * __useDeleteAccountMutation__
 *
 * To run a mutation, you first call `useDeleteAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteAccountMutation, { data, loading, error }] = useDeleteAccountMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteAccountMutation(baseOptions?: Apollo.MutationHookOptions<DeleteAccountMutation, DeleteAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteAccountMutation, DeleteAccountMutationVariables>(DeleteAccountDocument, options);
      }
export type DeleteAccountMutationHookResult = ReturnType<typeof useDeleteAccountMutation>;
export type DeleteAccountMutationResult = Apollo.MutationResult<DeleteAccountMutation>;
export type DeleteAccountMutationOptions = Apollo.BaseMutationOptions<DeleteAccountMutation, DeleteAccountMutationVariables>;
export const SetDefaultAccountDocument = gql`
    mutation SetDefaultAccount($id: String!) {
  setDefaultAccount(id: $id) {
    id
    name
    isDefault
  }
}
    `;
export type SetDefaultAccountMutationFn = Apollo.MutationFunction<SetDefaultAccountMutation, SetDefaultAccountMutationVariables>;

/**
 * __useSetDefaultAccountMutation__
 *
 * To run a mutation, you first call `useSetDefaultAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSetDefaultAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [setDefaultAccountMutation, { data, loading, error }] = useSetDefaultAccountMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useSetDefaultAccountMutation(baseOptions?: Apollo.MutationHookOptions<SetDefaultAccountMutation, SetDefaultAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SetDefaultAccountMutation, SetDefaultAccountMutationVariables>(SetDefaultAccountDocument, options);
      }
export type SetDefaultAccountMutationHookResult = ReturnType<typeof useSetDefaultAccountMutation>;
export type SetDefaultAccountMutationResult = Apollo.MutationResult<SetDefaultAccountMutation>;
export type SetDefaultAccountMutationOptions = Apollo.BaseMutationOptions<SetDefaultAccountMutation, SetDefaultAccountMutationVariables>;
export const CreateAnalyticsDocument = gql`
    mutation CreateAnalytics($input: AnalyticsRequestInput!) {
  createAnalytics(input: $input) {
    id
    type
    status
    accountId
    dateFrom
    dateTo
    comment
    createdAt
    account {
      id
      name
    }
  }
}
    `;
export type CreateAnalyticsMutationFn = Apollo.MutationFunction<CreateAnalyticsMutation, CreateAnalyticsMutationVariables>;

/**
 * __useCreateAnalyticsMutation__
 *
 * To run a mutation, you first call `useCreateAnalyticsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateAnalyticsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createAnalyticsMutation, { data, loading, error }] = useCreateAnalyticsMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateAnalyticsMutation(baseOptions?: Apollo.MutationHookOptions<CreateAnalyticsMutation, CreateAnalyticsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateAnalyticsMutation, CreateAnalyticsMutationVariables>(CreateAnalyticsDocument, options);
      }
export type CreateAnalyticsMutationHookResult = ReturnType<typeof useCreateAnalyticsMutation>;
export type CreateAnalyticsMutationResult = Apollo.MutationResult<CreateAnalyticsMutation>;
export type CreateAnalyticsMutationOptions = Apollo.BaseMutationOptions<CreateAnalyticsMutation, CreateAnalyticsMutationVariables>;
export const RefreshAnalyticsDocument = gql`
    mutation RefreshAnalytics($id: String!) {
  refreshAnalytics(id: $id) {
    id
    status
    updatedAt
  }
}
    `;
export type RefreshAnalyticsMutationFn = Apollo.MutationFunction<RefreshAnalyticsMutation, RefreshAnalyticsMutationVariables>;

/**
 * __useRefreshAnalyticsMutation__
 *
 * To run a mutation, you first call `useRefreshAnalyticsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRefreshAnalyticsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [refreshAnalyticsMutation, { data, loading, error }] = useRefreshAnalyticsMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useRefreshAnalyticsMutation(baseOptions?: Apollo.MutationHookOptions<RefreshAnalyticsMutation, RefreshAnalyticsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RefreshAnalyticsMutation, RefreshAnalyticsMutationVariables>(RefreshAnalyticsDocument, options);
      }
export type RefreshAnalyticsMutationHookResult = ReturnType<typeof useRefreshAnalyticsMutation>;
export type RefreshAnalyticsMutationResult = Apollo.MutationResult<RefreshAnalyticsMutation>;
export type RefreshAnalyticsMutationOptions = Apollo.BaseMutationOptions<RefreshAnalyticsMutation, RefreshAnalyticsMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($input: RegisterInput!) {
  register(input: $input) {
    id
    email
    name
    isEmailConfirmed
    jwtToken
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const LoginDocument = gql`
    mutation Login($input: LoginInput!) {
  login(input: $input) {
    id
    email
    name
    imageUrl
    isActive
    isEmailConfirmed
    jwtToken
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const ConfirmEmailDocument = gql`
    mutation ConfirmEmail($input: ConfirmEmailInput!) {
  confirmEmail(input: $input) {
    id
    email
    isEmailConfirmed
  }
}
    `;
export type ConfirmEmailMutationFn = Apollo.MutationFunction<ConfirmEmailMutation, ConfirmEmailMutationVariables>;

/**
 * __useConfirmEmailMutation__
 *
 * To run a mutation, you first call `useConfirmEmailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useConfirmEmailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [confirmEmailMutation, { data, loading, error }] = useConfirmEmailMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useConfirmEmailMutation(baseOptions?: Apollo.MutationHookOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ConfirmEmailMutation, ConfirmEmailMutationVariables>(ConfirmEmailDocument, options);
      }
export type ConfirmEmailMutationHookResult = ReturnType<typeof useConfirmEmailMutation>;
export type ConfirmEmailMutationResult = Apollo.MutationResult<ConfirmEmailMutation>;
export type ConfirmEmailMutationOptions = Apollo.BaseMutationOptions<ConfirmEmailMutation, ConfirmEmailMutationVariables>;
export const CreateBudgetDocument = gql`
    mutation CreateBudget($input: BudgetCreateInput!) {
  createBudget(input: $input) {
    id
    name
    category
    type
    targetAmount
    currentAmount
    lastAlertSent
    userId
    createdAt
    updatedAt
  }
}
    `;
export type CreateBudgetMutationFn = Apollo.MutationFunction<CreateBudgetMutation, CreateBudgetMutationVariables>;

/**
 * __useCreateBudgetMutation__
 *
 * To run a mutation, you first call `useCreateBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createBudgetMutation, { data, loading, error }] = useCreateBudgetMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateBudgetMutation(baseOptions?: Apollo.MutationHookOptions<CreateBudgetMutation, CreateBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateBudgetMutation, CreateBudgetMutationVariables>(CreateBudgetDocument, options);
      }
export type CreateBudgetMutationHookResult = ReturnType<typeof useCreateBudgetMutation>;
export type CreateBudgetMutationResult = Apollo.MutationResult<CreateBudgetMutation>;
export type CreateBudgetMutationOptions = Apollo.BaseMutationOptions<CreateBudgetMutation, CreateBudgetMutationVariables>;
export const UpdateBudgetDocument = gql`
    mutation UpdateBudget($id: String!, $input: BudgetUpdateInput!) {
  updateBudget(id: $id, input: $input) {
    id
    name
    category
    type
    targetAmount
    currentAmount
    lastAlertSent
    userId
    updatedAt
  }
}
    `;
export type UpdateBudgetMutationFn = Apollo.MutationFunction<UpdateBudgetMutation, UpdateBudgetMutationVariables>;

/**
 * __useUpdateBudgetMutation__
 *
 * To run a mutation, you first call `useUpdateBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateBudgetMutation, { data, loading, error }] = useUpdateBudgetMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateBudgetMutation(baseOptions?: Apollo.MutationHookOptions<UpdateBudgetMutation, UpdateBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateBudgetMutation, UpdateBudgetMutationVariables>(UpdateBudgetDocument, options);
      }
export type UpdateBudgetMutationHookResult = ReturnType<typeof useUpdateBudgetMutation>;
export type UpdateBudgetMutationResult = Apollo.MutationResult<UpdateBudgetMutation>;
export type UpdateBudgetMutationOptions = Apollo.BaseMutationOptions<UpdateBudgetMutation, UpdateBudgetMutationVariables>;
export const DeleteBudgetDocument = gql`
    mutation DeleteBudget($id: String!) {
  deleteBudget(id: $id) {
    id
    name
    category
    type
    targetAmount
  }
}
    `;
export type DeleteBudgetMutationFn = Apollo.MutationFunction<DeleteBudgetMutation, DeleteBudgetMutationVariables>;

/**
 * __useDeleteBudgetMutation__
 *
 * To run a mutation, you first call `useDeleteBudgetMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteBudgetMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteBudgetMutation, { data, loading, error }] = useDeleteBudgetMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteBudgetMutation(baseOptions?: Apollo.MutationHookOptions<DeleteBudgetMutation, DeleteBudgetMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteBudgetMutation, DeleteBudgetMutationVariables>(DeleteBudgetDocument, options);
      }
export type DeleteBudgetMutationHookResult = ReturnType<typeof useDeleteBudgetMutation>;
export type DeleteBudgetMutationResult = Apollo.MutationResult<DeleteBudgetMutation>;
export type DeleteBudgetMutationOptions = Apollo.BaseMutationOptions<DeleteBudgetMutation, DeleteBudgetMutationVariables>;
export const SendMessageDocument = gql`
    mutation SendMessage($input: ChatMessageCreateInput!) {
  sendMessage(input: $input) {
    id
    status
    userMessage
    aiResponse
    error
    userId
    createdAt
    updatedAt
  }
}
    `;
export type SendMessageMutationFn = Apollo.MutationFunction<SendMessageMutation, SendMessageMutationVariables>;

/**
 * __useSendMessageMutation__
 *
 * To run a mutation, you first call `useSendMessageMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSendMessageMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [sendMessageMutation, { data, loading, error }] = useSendMessageMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useSendMessageMutation(baseOptions?: Apollo.MutationHookOptions<SendMessageMutation, SendMessageMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SendMessageMutation, SendMessageMutationVariables>(SendMessageDocument, options);
      }
export type SendMessageMutationHookResult = ReturnType<typeof useSendMessageMutation>;
export type SendMessageMutationResult = Apollo.MutationResult<SendMessageMutation>;
export type SendMessageMutationOptions = Apollo.BaseMutationOptions<SendMessageMutation, SendMessageMutationVariables>;
export const UpdateImageStoreDocument = gql`
    mutation UpdateImageStore($input: ImageStoreUpdateInput!) {
  updateImageStore(input: $input) {
    id
    name
    description
    ext
    url
    updatedAt
    createdAt
    width
    height
    downloadUrl
    avatarUrl
    isVisible
    checksum
  }
}
    `;
export type UpdateImageStoreMutationFn = Apollo.MutationFunction<UpdateImageStoreMutation, UpdateImageStoreMutationVariables>;

/**
 * __useUpdateImageStoreMutation__
 *
 * To run a mutation, you first call `useUpdateImageStoreMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateImageStoreMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateImageStoreMutation, { data, loading, error }] = useUpdateImageStoreMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateImageStoreMutation(baseOptions?: Apollo.MutationHookOptions<UpdateImageStoreMutation, UpdateImageStoreMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateImageStoreMutation, UpdateImageStoreMutationVariables>(UpdateImageStoreDocument, options);
      }
export type UpdateImageStoreMutationHookResult = ReturnType<typeof useUpdateImageStoreMutation>;
export type UpdateImageStoreMutationResult = Apollo.MutationResult<UpdateImageStoreMutation>;
export type UpdateImageStoreMutationOptions = Apollo.BaseMutationOptions<UpdateImageStoreMutation, UpdateImageStoreMutationVariables>;
export const UpdateProfileDocument = gql`
    mutation UpdateProfile($input: UserUpdateInput!) {
  updateProfile(input: $input) {
    id
    email
    name
    imageUrl
    isActive
    isEmailConfirmed
    createdAt
    updatedAt
    logo {
      id
      url
      avatarUrl
    }
  }
}
    `;
export type UpdateProfileMutationFn = Apollo.MutationFunction<UpdateProfileMutation, UpdateProfileMutationVariables>;

/**
 * __useUpdateProfileMutation__
 *
 * To run a mutation, you first call `useUpdateProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateProfileMutation, { data, loading, error }] = useUpdateProfileMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateProfileMutation(baseOptions?: Apollo.MutationHookOptions<UpdateProfileMutation, UpdateProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateProfileMutation, UpdateProfileMutationVariables>(UpdateProfileDocument, options);
      }
export type UpdateProfileMutationHookResult = ReturnType<typeof useUpdateProfileMutation>;
export type UpdateProfileMutationResult = Apollo.MutationResult<UpdateProfileMutation>;
export type UpdateProfileMutationOptions = Apollo.BaseMutationOptions<UpdateProfileMutation, UpdateProfileMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($input: PasswordChangeInput!) {
  changePassword(input: $input) {
    id
    email
    name
    updatedAt
  }
}
    `;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, options);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const DeleteProfileDocument = gql`
    mutation DeleteProfile {
  deleteProfile {
    id
    email
    name
  }
}
    `;
export type DeleteProfileMutationFn = Apollo.MutationFunction<DeleteProfileMutation, DeleteProfileMutationVariables>;

/**
 * __useDeleteProfileMutation__
 *
 * To run a mutation, you first call `useDeleteProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteProfileMutation, { data, loading, error }] = useDeleteProfileMutation({
 *   variables: {
 *   },
 * });
 */
export function useDeleteProfileMutation(baseOptions?: Apollo.MutationHookOptions<DeleteProfileMutation, DeleteProfileMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteProfileMutation, DeleteProfileMutationVariables>(DeleteProfileDocument, options);
      }
export type DeleteProfileMutationHookResult = ReturnType<typeof useDeleteProfileMutation>;
export type DeleteProfileMutationResult = Apollo.MutationResult<DeleteProfileMutation>;
export type DeleteProfileMutationOptions = Apollo.BaseMutationOptions<DeleteProfileMutation, DeleteProfileMutationVariables>;
export const SyncTBankAccountDocument = gql`
    mutation SyncTBankAccount($accountId: String!) {
  syncTBankAccount(accountId: $accountId)
}
    `;
export type SyncTBankAccountMutationFn = Apollo.MutationFunction<SyncTBankAccountMutation, SyncTBankAccountMutationVariables>;

/**
 * __useSyncTBankAccountMutation__
 *
 * To run a mutation, you first call `useSyncTBankAccountMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncTBankAccountMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncTBankAccountMutation, { data, loading, error }] = useSyncTBankAccountMutation({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useSyncTBankAccountMutation(baseOptions?: Apollo.MutationHookOptions<SyncTBankAccountMutation, SyncTBankAccountMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncTBankAccountMutation, SyncTBankAccountMutationVariables>(SyncTBankAccountDocument, options);
      }
export type SyncTBankAccountMutationHookResult = ReturnType<typeof useSyncTBankAccountMutation>;
export type SyncTBankAccountMutationResult = Apollo.MutationResult<SyncTBankAccountMutation>;
export type SyncTBankAccountMutationOptions = Apollo.BaseMutationOptions<SyncTBankAccountMutation, SyncTBankAccountMutationVariables>;
export const SyncAllTBankAccountsDocument = gql`
    mutation SyncAllTBankAccounts {
  syncAllTBankAccounts {
    accountsSynced
    totalTransactions
  }
}
    `;
export type SyncAllTBankAccountsMutationFn = Apollo.MutationFunction<SyncAllTBankAccountsMutation, SyncAllTBankAccountsMutationVariables>;

/**
 * __useSyncAllTBankAccountsMutation__
 *
 * To run a mutation, you first call `useSyncAllTBankAccountsMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useSyncAllTBankAccountsMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [syncAllTBankAccountsMutation, { data, loading, error }] = useSyncAllTBankAccountsMutation({
 *   variables: {
 *   },
 * });
 */
export function useSyncAllTBankAccountsMutation(baseOptions?: Apollo.MutationHookOptions<SyncAllTBankAccountsMutation, SyncAllTBankAccountsMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<SyncAllTBankAccountsMutation, SyncAllTBankAccountsMutationVariables>(SyncAllTBankAccountsDocument, options);
      }
export type SyncAllTBankAccountsMutationHookResult = ReturnType<typeof useSyncAllTBankAccountsMutation>;
export type SyncAllTBankAccountsMutationResult = Apollo.MutationResult<SyncAllTBankAccountsMutation>;
export type SyncAllTBankAccountsMutationOptions = Apollo.BaseMutationOptions<SyncAllTBankAccountsMutation, SyncAllTBankAccountsMutationVariables>;
export const CreateTransactionDocument = gql`
    mutation CreateTransaction($input: TransactionCreateInput!) {
  createTransaction(input: $input) {
    id
    type
    amount
    description
    date
    category
    receiptUrl
    isRecurring
    recurringInterval
    status
    accountId
    createdAt
    updatedAt
  }
}
    `;
export type CreateTransactionMutationFn = Apollo.MutationFunction<CreateTransactionMutation, CreateTransactionMutationVariables>;

/**
 * __useCreateTransactionMutation__
 *
 * To run a mutation, you first call `useCreateTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createTransactionMutation, { data, loading, error }] = useCreateTransactionMutation({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useCreateTransactionMutation(baseOptions?: Apollo.MutationHookOptions<CreateTransactionMutation, CreateTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateTransactionMutation, CreateTransactionMutationVariables>(CreateTransactionDocument, options);
      }
export type CreateTransactionMutationHookResult = ReturnType<typeof useCreateTransactionMutation>;
export type CreateTransactionMutationResult = Apollo.MutationResult<CreateTransactionMutation>;
export type CreateTransactionMutationOptions = Apollo.BaseMutationOptions<CreateTransactionMutation, CreateTransactionMutationVariables>;
export const UpdateTransactionDocument = gql`
    mutation UpdateTransaction($id: String!, $input: TransactionUpdateInput!) {
  updateTransaction(id: $id, input: $input) {
    id
    type
    amount
    description
    date
    category
    receiptUrl
    isRecurring
    recurringInterval
    status
    updatedAt
  }
}
    `;
export type UpdateTransactionMutationFn = Apollo.MutationFunction<UpdateTransactionMutation, UpdateTransactionMutationVariables>;

/**
 * __useUpdateTransactionMutation__
 *
 * To run a mutation, you first call `useUpdateTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useUpdateTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [updateTransactionMutation, { data, loading, error }] = useUpdateTransactionMutation({
 *   variables: {
 *      id: // value for 'id'
 *      input: // value for 'input'
 *   },
 * });
 */
export function useUpdateTransactionMutation(baseOptions?: Apollo.MutationHookOptions<UpdateTransactionMutation, UpdateTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<UpdateTransactionMutation, UpdateTransactionMutationVariables>(UpdateTransactionDocument, options);
      }
export type UpdateTransactionMutationHookResult = ReturnType<typeof useUpdateTransactionMutation>;
export type UpdateTransactionMutationResult = Apollo.MutationResult<UpdateTransactionMutation>;
export type UpdateTransactionMutationOptions = Apollo.BaseMutationOptions<UpdateTransactionMutation, UpdateTransactionMutationVariables>;
export const DeleteTransactionDocument = gql`
    mutation DeleteTransaction($id: String!) {
  deleteTransaction(id: $id) {
    id
    description
    amount
  }
}
    `;
export type DeleteTransactionMutationFn = Apollo.MutationFunction<DeleteTransactionMutation, DeleteTransactionMutationVariables>;

/**
 * __useDeleteTransactionMutation__
 *
 * To run a mutation, you first call `useDeleteTransactionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteTransactionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteTransactionMutation, { data, loading, error }] = useDeleteTransactionMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteTransactionMutation(baseOptions?: Apollo.MutationHookOptions<DeleteTransactionMutation, DeleteTransactionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<DeleteTransactionMutation, DeleteTransactionMutationVariables>(DeleteTransactionDocument, options);
      }
export type DeleteTransactionMutationHookResult = ReturnType<typeof useDeleteTransactionMutation>;
export type DeleteTransactionMutationResult = Apollo.MutationResult<DeleteTransactionMutation>;
export type DeleteTransactionMutationOptions = Apollo.BaseMutationOptions<DeleteTransactionMutation, DeleteTransactionMutationVariables>;
export const GetAccountsDocument = gql`
    query GetAccounts {
  accounts {
    id
    name
    type
    balance
    isDefault
    bankType
    accountNumber
    createdAt
    updatedAt
    transactions {
      id
      type
      amount
      date
    }
  }
}
    `;

/**
 * __useGetAccountsQuery__
 *
 * To run a query within a React component, call `useGetAccountsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAccountsQuery(baseOptions?: Apollo.QueryHookOptions<GetAccountsQuery, GetAccountsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAccountsQuery, GetAccountsQueryVariables>(GetAccountsDocument, options);
      }
export function useGetAccountsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAccountsQuery, GetAccountsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAccountsQuery, GetAccountsQueryVariables>(GetAccountsDocument, options);
        }
export function useGetAccountsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAccountsQuery, GetAccountsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAccountsQuery, GetAccountsQueryVariables>(GetAccountsDocument, options);
        }
export type GetAccountsQueryHookResult = ReturnType<typeof useGetAccountsQuery>;
export type GetAccountsLazyQueryHookResult = ReturnType<typeof useGetAccountsLazyQuery>;
export type GetAccountsSuspenseQueryHookResult = ReturnType<typeof useGetAccountsSuspenseQuery>;
export type GetAccountsQueryResult = Apollo.QueryResult<GetAccountsQuery, GetAccountsQueryVariables>;
export const GetAccountDocument = gql`
    query GetAccount($id: String!) {
  account(id: $id) {
    id
    name
    type
    balance
    isDefault
    bankType
    accountNumber
    createdAt
    updatedAt
    transactions {
      id
      type
      amount
      description
      date
      category
      status
    }
  }
}
    `;

/**
 * __useGetAccountQuery__
 *
 * To run a query within a React component, call `useGetAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAccountQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAccountQuery(baseOptions: Apollo.QueryHookOptions<GetAccountQuery, GetAccountQueryVariables> & ({ variables: GetAccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAccountQuery, GetAccountQueryVariables>(GetAccountDocument, options);
      }
export function useGetAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAccountQuery, GetAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAccountQuery, GetAccountQueryVariables>(GetAccountDocument, options);
        }
export function useGetAccountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAccountQuery, GetAccountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAccountQuery, GetAccountQueryVariables>(GetAccountDocument, options);
        }
export type GetAccountQueryHookResult = ReturnType<typeof useGetAccountQuery>;
export type GetAccountLazyQueryHookResult = ReturnType<typeof useGetAccountLazyQuery>;
export type GetAccountSuspenseQueryHookResult = ReturnType<typeof useGetAccountSuspenseQuery>;
export type GetAccountQueryResult = Apollo.QueryResult<GetAccountQuery, GetAccountQueryVariables>;
export const GetAnalyticsTaskDocument = gql`
    query GetAnalyticsTask($id: String!) {
  analyticsTask(id: $id) {
    id
    type
    status
    accountId
    dateFrom
    dateTo
    comment
    result
    error
    userId
    account {
      id
      name
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetAnalyticsTaskQuery__
 *
 * To run a query within a React component, call `useGetAnalyticsTaskQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnalyticsTaskQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnalyticsTaskQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetAnalyticsTaskQuery(baseOptions: Apollo.QueryHookOptions<GetAnalyticsTaskQuery, GetAnalyticsTaskQueryVariables> & ({ variables: GetAnalyticsTaskQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAnalyticsTaskQuery, GetAnalyticsTaskQueryVariables>(GetAnalyticsTaskDocument, options);
      }
export function useGetAnalyticsTaskLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAnalyticsTaskQuery, GetAnalyticsTaskQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAnalyticsTaskQuery, GetAnalyticsTaskQueryVariables>(GetAnalyticsTaskDocument, options);
        }
export function useGetAnalyticsTaskSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAnalyticsTaskQuery, GetAnalyticsTaskQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAnalyticsTaskQuery, GetAnalyticsTaskQueryVariables>(GetAnalyticsTaskDocument, options);
        }
export type GetAnalyticsTaskQueryHookResult = ReturnType<typeof useGetAnalyticsTaskQuery>;
export type GetAnalyticsTaskLazyQueryHookResult = ReturnType<typeof useGetAnalyticsTaskLazyQuery>;
export type GetAnalyticsTaskSuspenseQueryHookResult = ReturnType<typeof useGetAnalyticsTaskSuspenseQuery>;
export type GetAnalyticsTaskQueryResult = Apollo.QueryResult<GetAnalyticsTaskQuery, GetAnalyticsTaskQueryVariables>;
export const GetAnalyticsTasksDocument = gql`
    query GetAnalyticsTasks($filter: AnalyticsFilterInput) {
  analyticsTasks(filter: $filter) {
    id
    type
    status
    accountId
    dateFrom
    dateTo
    comment
    result
    error
    createdAt
    updatedAt
    account {
      id
      name
    }
  }
}
    `;

/**
 * __useGetAnalyticsTasksQuery__
 *
 * To run a query within a React component, call `useGetAnalyticsTasksQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAnalyticsTasksQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAnalyticsTasksQuery({
 *   variables: {
 *      filter: // value for 'filter'
 *   },
 * });
 */
export function useGetAnalyticsTasksQuery(baseOptions?: Apollo.QueryHookOptions<GetAnalyticsTasksQuery, GetAnalyticsTasksQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAnalyticsTasksQuery, GetAnalyticsTasksQueryVariables>(GetAnalyticsTasksDocument, options);
      }
export function useGetAnalyticsTasksLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAnalyticsTasksQuery, GetAnalyticsTasksQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAnalyticsTasksQuery, GetAnalyticsTasksQueryVariables>(GetAnalyticsTasksDocument, options);
        }
export function useGetAnalyticsTasksSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetAnalyticsTasksQuery, GetAnalyticsTasksQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetAnalyticsTasksQuery, GetAnalyticsTasksQueryVariables>(GetAnalyticsTasksDocument, options);
        }
export type GetAnalyticsTasksQueryHookResult = ReturnType<typeof useGetAnalyticsTasksQuery>;
export type GetAnalyticsTasksLazyQueryHookResult = ReturnType<typeof useGetAnalyticsTasksLazyQuery>;
export type GetAnalyticsTasksSuspenseQueryHookResult = ReturnType<typeof useGetAnalyticsTasksSuspenseQuery>;
export type GetAnalyticsTasksQueryResult = Apollo.QueryResult<GetAnalyticsTasksQuery, GetAnalyticsTasksQueryVariables>;
export const GetActiveAnalyticsJobsDocument = gql`
    query GetActiveAnalyticsJobs {
  activeAnalyticsJobs {
    id
    type
    status
    accountId
    dateFrom
    dateTo
    comment
    createdAt
    account {
      id
      name
    }
  }
}
    `;

/**
 * __useGetActiveAnalyticsJobsQuery__
 *
 * To run a query within a React component, call `useGetActiveAnalyticsJobsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetActiveAnalyticsJobsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetActiveAnalyticsJobsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetActiveAnalyticsJobsQuery(baseOptions?: Apollo.QueryHookOptions<GetActiveAnalyticsJobsQuery, GetActiveAnalyticsJobsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetActiveAnalyticsJobsQuery, GetActiveAnalyticsJobsQueryVariables>(GetActiveAnalyticsJobsDocument, options);
      }
export function useGetActiveAnalyticsJobsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetActiveAnalyticsJobsQuery, GetActiveAnalyticsJobsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetActiveAnalyticsJobsQuery, GetActiveAnalyticsJobsQueryVariables>(GetActiveAnalyticsJobsDocument, options);
        }
export function useGetActiveAnalyticsJobsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetActiveAnalyticsJobsQuery, GetActiveAnalyticsJobsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetActiveAnalyticsJobsQuery, GetActiveAnalyticsJobsQueryVariables>(GetActiveAnalyticsJobsDocument, options);
        }
export type GetActiveAnalyticsJobsQueryHookResult = ReturnType<typeof useGetActiveAnalyticsJobsQuery>;
export type GetActiveAnalyticsJobsLazyQueryHookResult = ReturnType<typeof useGetActiveAnalyticsJobsLazyQuery>;
export type GetActiveAnalyticsJobsSuspenseQueryHookResult = ReturnType<typeof useGetActiveAnalyticsJobsSuspenseQuery>;
export type GetActiveAnalyticsJobsQueryResult = Apollo.QueryResult<GetActiveAnalyticsJobsQuery, GetActiveAnalyticsJobsQueryVariables>;
export const GetCurrentUserDocument = gql`
    query GetCurrentUser {
  getCurrentUser {
    id
    email
    name
    imageUrl
    isActive
    isEmailConfirmed
    jwtToken
    createdAt
    updatedAt
    logo {
      id
      url
      avatarUrl
    }
  }
}
    `;

/**
 * __useGetCurrentUserQuery__
 *
 * To run a query within a React component, call `useGetCurrentUserQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetCurrentUserQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetCurrentUserQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetCurrentUserQuery(baseOptions?: Apollo.QueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
      }
export function useGetCurrentUserLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export function useGetCurrentUserSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetCurrentUserQuery, GetCurrentUserQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetCurrentUserQuery, GetCurrentUserQueryVariables>(GetCurrentUserDocument, options);
        }
export type GetCurrentUserQueryHookResult = ReturnType<typeof useGetCurrentUserQuery>;
export type GetCurrentUserLazyQueryHookResult = ReturnType<typeof useGetCurrentUserLazyQuery>;
export type GetCurrentUserSuspenseQueryHookResult = ReturnType<typeof useGetCurrentUserSuspenseQuery>;
export type GetCurrentUserQueryResult = Apollo.QueryResult<GetCurrentUserQuery, GetCurrentUserQueryVariables>;
export const GetBudgetsDocument = gql`
    query GetBudgets {
  budgets {
    id
    name
    category
    type
    targetAmount
    currentAmount
    lastAlertSent
    userId
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetBudgetsQuery__
 *
 * To run a query within a React component, call `useGetBudgetsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBudgetsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBudgetsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetBudgetsQuery(baseOptions?: Apollo.QueryHookOptions<GetBudgetsQuery, GetBudgetsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBudgetsQuery, GetBudgetsQueryVariables>(GetBudgetsDocument, options);
      }
export function useGetBudgetsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBudgetsQuery, GetBudgetsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBudgetsQuery, GetBudgetsQueryVariables>(GetBudgetsDocument, options);
        }
export function useGetBudgetsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBudgetsQuery, GetBudgetsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBudgetsQuery, GetBudgetsQueryVariables>(GetBudgetsDocument, options);
        }
export type GetBudgetsQueryHookResult = ReturnType<typeof useGetBudgetsQuery>;
export type GetBudgetsLazyQueryHookResult = ReturnType<typeof useGetBudgetsLazyQuery>;
export type GetBudgetsSuspenseQueryHookResult = ReturnType<typeof useGetBudgetsSuspenseQuery>;
export type GetBudgetsQueryResult = Apollo.QueryResult<GetBudgetsQuery, GetBudgetsQueryVariables>;
export const GetBudgetDocument = gql`
    query GetBudget($id: String!) {
  budget(id: $id) {
    id
    name
    category
    type
    targetAmount
    currentAmount
    lastAlertSent
    userId
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetBudgetQuery__
 *
 * To run a query within a React component, call `useGetBudgetQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetBudgetQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetBudgetQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetBudgetQuery(baseOptions: Apollo.QueryHookOptions<GetBudgetQuery, GetBudgetQueryVariables> & ({ variables: GetBudgetQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetBudgetQuery, GetBudgetQueryVariables>(GetBudgetDocument, options);
      }
export function useGetBudgetLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetBudgetQuery, GetBudgetQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetBudgetQuery, GetBudgetQueryVariables>(GetBudgetDocument, options);
        }
export function useGetBudgetSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetBudgetQuery, GetBudgetQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetBudgetQuery, GetBudgetQueryVariables>(GetBudgetDocument, options);
        }
export type GetBudgetQueryHookResult = ReturnType<typeof useGetBudgetQuery>;
export type GetBudgetLazyQueryHookResult = ReturnType<typeof useGetBudgetLazyQuery>;
export type GetBudgetSuspenseQueryHookResult = ReturnType<typeof useGetBudgetSuspenseQuery>;
export type GetBudgetQueryResult = Apollo.QueryResult<GetBudgetQuery, GetBudgetQueryVariables>;
export const GetMessageStatusDocument = gql`
    query GetMessageStatus($messageId: String!) {
  getMessageStatus(messageId: $messageId) {
    id
    status
    userMessage
    aiResponse
    error
    userId
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetMessageStatusQuery__
 *
 * To run a query within a React component, call `useGetMessageStatusQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetMessageStatusQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetMessageStatusQuery({
 *   variables: {
 *      messageId: // value for 'messageId'
 *   },
 * });
 */
export function useGetMessageStatusQuery(baseOptions: Apollo.QueryHookOptions<GetMessageStatusQuery, GetMessageStatusQueryVariables> & ({ variables: GetMessageStatusQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetMessageStatusQuery, GetMessageStatusQueryVariables>(GetMessageStatusDocument, options);
      }
export function useGetMessageStatusLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetMessageStatusQuery, GetMessageStatusQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetMessageStatusQuery, GetMessageStatusQueryVariables>(GetMessageStatusDocument, options);
        }
export function useGetMessageStatusSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetMessageStatusQuery, GetMessageStatusQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetMessageStatusQuery, GetMessageStatusQueryVariables>(GetMessageStatusDocument, options);
        }
export type GetMessageStatusQueryHookResult = ReturnType<typeof useGetMessageStatusQuery>;
export type GetMessageStatusLazyQueryHookResult = ReturnType<typeof useGetMessageStatusLazyQuery>;
export type GetMessageStatusSuspenseQueryHookResult = ReturnType<typeof useGetMessageStatusSuspenseQuery>;
export type GetMessageStatusQueryResult = Apollo.QueryResult<GetMessageStatusQuery, GetMessageStatusQueryVariables>;
export const HealthCheckDocument = gql`
    query HealthCheck {
  healthCheck
}
    `;

/**
 * __useHealthCheckQuery__
 *
 * To run a query within a React component, call `useHealthCheckQuery` and pass it any options that fit your needs.
 * When your component renders, `useHealthCheckQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useHealthCheckQuery({
 *   variables: {
 *   },
 * });
 */
export function useHealthCheckQuery(baseOptions?: Apollo.QueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
      }
export function useHealthCheckLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
        }
export function useHealthCheckSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<HealthCheckQuery, HealthCheckQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<HealthCheckQuery, HealthCheckQueryVariables>(HealthCheckDocument, options);
        }
export type HealthCheckQueryHookResult = ReturnType<typeof useHealthCheckQuery>;
export type HealthCheckLazyQueryHookResult = ReturnType<typeof useHealthCheckLazyQuery>;
export type HealthCheckSuspenseQueryHookResult = ReturnType<typeof useHealthCheckSuspenseQuery>;
export type HealthCheckQueryResult = Apollo.QueryResult<HealthCheckQuery, HealthCheckQueryVariables>;
export const GetTransactionsDocument = gql`
    query GetTransactions {
  transactions {
    id
    type
    amount
    description
    date
    category
    receiptUrl
    isRecurring
    recurringInterval
    nextRecurringDate
    status
    accountId
    account {
      id
      name
      bankType
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetTransactionsQuery__
 *
 * To run a query within a React component, call `useGetTransactionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionsQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetTransactionsQuery(baseOptions?: Apollo.QueryHookOptions<GetTransactionsQuery, GetTransactionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(GetTransactionsDocument, options);
      }
export function useGetTransactionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionsQuery, GetTransactionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(GetTransactionsDocument, options);
        }
export function useGetTransactionsSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTransactionsQuery, GetTransactionsQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTransactionsQuery, GetTransactionsQueryVariables>(GetTransactionsDocument, options);
        }
export type GetTransactionsQueryHookResult = ReturnType<typeof useGetTransactionsQuery>;
export type GetTransactionsLazyQueryHookResult = ReturnType<typeof useGetTransactionsLazyQuery>;
export type GetTransactionsSuspenseQueryHookResult = ReturnType<typeof useGetTransactionsSuspenseQuery>;
export type GetTransactionsQueryResult = Apollo.QueryResult<GetTransactionsQuery, GetTransactionsQueryVariables>;
export const GetTransactionsByAccountDocument = gql`
    query GetTransactionsByAccount($accountId: String!) {
  transactionsByAccount(accountId: $accountId) {
    id
    type
    amount
    description
    date
    category
    receiptUrl
    isRecurring
    status
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetTransactionsByAccountQuery__
 *
 * To run a query within a React component, call `useGetTransactionsByAccountQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionsByAccountQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionsByAccountQuery({
 *   variables: {
 *      accountId: // value for 'accountId'
 *   },
 * });
 */
export function useGetTransactionsByAccountQuery(baseOptions: Apollo.QueryHookOptions<GetTransactionsByAccountQuery, GetTransactionsByAccountQueryVariables> & ({ variables: GetTransactionsByAccountQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactionsByAccountQuery, GetTransactionsByAccountQueryVariables>(GetTransactionsByAccountDocument, options);
      }
export function useGetTransactionsByAccountLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionsByAccountQuery, GetTransactionsByAccountQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactionsByAccountQuery, GetTransactionsByAccountQueryVariables>(GetTransactionsByAccountDocument, options);
        }
export function useGetTransactionsByAccountSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTransactionsByAccountQuery, GetTransactionsByAccountQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTransactionsByAccountQuery, GetTransactionsByAccountQueryVariables>(GetTransactionsByAccountDocument, options);
        }
export type GetTransactionsByAccountQueryHookResult = ReturnType<typeof useGetTransactionsByAccountQuery>;
export type GetTransactionsByAccountLazyQueryHookResult = ReturnType<typeof useGetTransactionsByAccountLazyQuery>;
export type GetTransactionsByAccountSuspenseQueryHookResult = ReturnType<typeof useGetTransactionsByAccountSuspenseQuery>;
export type GetTransactionsByAccountQueryResult = Apollo.QueryResult<GetTransactionsByAccountQuery, GetTransactionsByAccountQueryVariables>;
export const GetTransactionDocument = gql`
    query GetTransaction($id: String!) {
  transaction(id: $id) {
    id
    type
    amount
    description
    date
    category
    receiptUrl
    isRecurring
    recurringInterval
    nextRecurringDate
    lastProcessed
    status
    accountId
    account {
      id
      name
      type
      bankType
    }
    createdAt
    updatedAt
  }
}
    `;

/**
 * __useGetTransactionQuery__
 *
 * To run a query within a React component, call `useGetTransactionQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionQuery({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useGetTransactionQuery(baseOptions: Apollo.QueryHookOptions<GetTransactionQuery, GetTransactionQueryVariables> & ({ variables: GetTransactionQueryVariables; skip?: boolean; } | { skip: boolean; }) ) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, options);
      }
export function useGetTransactionLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionQuery, GetTransactionQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, options);
        }
export function useGetTransactionSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTransactionQuery, GetTransactionQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTransactionQuery, GetTransactionQueryVariables>(GetTransactionDocument, options);
        }
export type GetTransactionQueryHookResult = ReturnType<typeof useGetTransactionQuery>;
export type GetTransactionLazyQueryHookResult = ReturnType<typeof useGetTransactionLazyQuery>;
export type GetTransactionSuspenseQueryHookResult = ReturnType<typeof useGetTransactionSuspenseQuery>;
export type GetTransactionQueryResult = Apollo.QueryResult<GetTransactionQuery, GetTransactionQueryVariables>;
export const GetTransactionsListDocument = gql`
    query GetTransactionsList($input: TransactionListInput) {
  transactionsList(input: $input) {
    totalCount
    data {
      id
      type
      amount
      description
      date
      category
      receiptUrl
      isRecurring
      recurringInterval
      nextRecurringDate
      lastProcessed
      status
      accountId
      account {
        id
        name
        type
        bankType
      }
      createdAt
      updatedAt
    }
  }
}
    `;

/**
 * __useGetTransactionsListQuery__
 *
 * To run a query within a React component, call `useGetTransactionsListQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetTransactionsListQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetTransactionsListQuery({
 *   variables: {
 *      input: // value for 'input'
 *   },
 * });
 */
export function useGetTransactionsListQuery(baseOptions?: Apollo.QueryHookOptions<GetTransactionsListQuery, GetTransactionsListQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetTransactionsListQuery, GetTransactionsListQueryVariables>(GetTransactionsListDocument, options);
      }
export function useGetTransactionsListLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetTransactionsListQuery, GetTransactionsListQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetTransactionsListQuery, GetTransactionsListQueryVariables>(GetTransactionsListDocument, options);
        }
export function useGetTransactionsListSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<GetTransactionsListQuery, GetTransactionsListQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<GetTransactionsListQuery, GetTransactionsListQueryVariables>(GetTransactionsListDocument, options);
        }
export type GetTransactionsListQueryHookResult = ReturnType<typeof useGetTransactionsListQuery>;
export type GetTransactionsListLazyQueryHookResult = ReturnType<typeof useGetTransactionsListLazyQuery>;
export type GetTransactionsListSuspenseQueryHookResult = ReturnType<typeof useGetTransactionsListSuspenseQuery>;
export type GetTransactionsListQueryResult = Apollo.QueryResult<GetTransactionsListQuery, GetTransactionsListQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    id
    email
    name
    imageUrl
    isActive
    isEmailConfirmed
    jwtToken
    createdAt
    updatedAt
    accounts {
      id
      name
      type
      balance
    }
    transactions {
      id
      type
      amount
    }
    budgets {
      id
      name
      category
      type
      targetAmount
      currentAmount
    }
    logo {
      id
      url
      avatarUrl
    }
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export function useMeSuspenseQuery(baseOptions?: Apollo.SkipToken | Apollo.SuspenseQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = baseOptions === Apollo.skipToken ? baseOptions : {...defaultOptions, ...baseOptions}
          return Apollo.useSuspenseQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeSuspenseQueryHookResult = ReturnType<typeof useMeSuspenseQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;