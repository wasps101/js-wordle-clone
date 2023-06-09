# js-wordle-clone

Простой клон популярной игры Wordle на чистом Javascript.

### Установка

Создайте локальную директорию, где вы будете хранить проект и перейдите в нее с помощью команды cd

```bash
cd my-directory
// my-directory - это имя вашей директории
```

Скопируйте репозиторий к себе с помощью команды:

```bash
git clone https://github.com/wasps101/js-wordle-clone.git
```

### Использование

Запустите проект с помощью локального сервера (например, Apache). Проект не работает с локальной машины, так как функция fetch конфликтует политикой CORS браузера.

### Демонстрационная версия

Вы можете воспользоваться слегка измененной под возможности CodePen версией проекта: [Демонстрационная версия в CodePen](https://codepen.io/wasps101/pen/xxaeGYo?editors=0010)

### Дополнительная информация

В качестве словаря для проекта был использован словарь [WebstersEnglishDictionary](https://github.com/matthewreagan/WebstersEnglishDictionary) пользователя [@matthewreagan](https://www.github.com/matthewreagan). 
Словарь был очищен от всех вхождений длиной не в 5 символов и вхождений, содержащих дефис.

## Лицензия 

[GNU General Public License v3.0](https://github.com/wasps101/js-wordle-clone/blob/main/LICENSE)
