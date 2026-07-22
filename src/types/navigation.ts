export type RootStackParamList = {
  MainTabs: undefined;
  TaskDetail: { taskId: string };
  EditTask: { taskId?: string };
};

export type MainTabParamList = {
  TaskList: undefined;
  Categories: undefined;
};
