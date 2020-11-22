





async createSets(todo: TodoItem): Promise<TodoItem> {
    await this.docClient.put({
        TableName: this.todosTable,
        Item: todo
    })
    .promise();
  return todo;
}