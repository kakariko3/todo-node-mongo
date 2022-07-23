// HTML要素を取得
const tasksDOM = document.querySelector('.tasks');
const formDOM = document.querySelector('.task-form');
const taskInputDOM = document.querySelector('.task-input');
const formAlertDOM = document.querySelector('.form-alert');

// /api/v1/tasksからタスクを読み込む
async function showTasks() {
  try {
    // 自作したAPIを叩く
    const { data: tasks } = await axios.get('/api/v1/tasks');

    // タスクが1つもないとき
    if (tasks.length < 1) {
      tasksDOM.innerHTML = `<h5 class="empty-list">タスクがありません</h5>`;
      return;
    }

    // タスクを出力
    const allTask = tasks
      .map((task) => {
        const { completed, _id, name } = task;
        return `<div class="single-task ${completed && 'task-completed'}">
                  <h5>
                    <span><i class="far fa-check-circle"></i></span>${name}
                  </h5>
                  <div class="task-links">
                    <!-- 編集リング -->
                    <a href="edit.html?id=${_id}" class="edit-link">
                      <i class="fas fa-edit"></i>
                    </a>
                    <!-- ゴミ箱リンク -->
                    <button type="button" class="delete-btn" data-id=${_id}>
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>`;
      })
      .join('');
    tasksDOM.innerHTML = allTask;
  } catch (err) {
    console.log(err);
  }
}
showTasks();

// タスクを新規作成する
formDOM.addEventListener('submit', async (e) => {
  e.preventDefault();
  const name = taskInputDOM.value;
  try {
    await axios.post('/api/v1/tasks', { name });
    showTasks();
    taskInputDOM.value = '';
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = 'タスクを追加しました';
    formAlertDOM.classList.add('text-success');
  } catch (err) {
    console.log(err);
    formAlertDOM.style.display = 'block';
    formAlertDOM.textContent = '無効です。もう一度やり直してください。';
  }
  setTimeout(() => {
    formAlertDOM.style.display = 'none';
    formAlertDOM.classList.remove('text-success');
  }, 3000);
});

// タスクを削除する
tasksDOM.addEventListener('click', async (e) => {
  const element = e.target;
  if (element.parentElement.classList.contains('delete-btn')) {
    const id = element.parentElement.dataset.id;
    try {
      await axios.delete(`/api/v1/tasks/${id}`);
      showTasks();
    } catch (err) {
      console.log(err);
    }
  }
});
