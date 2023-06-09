# Readme

## Запуск

Приложение запущено и развернуто на публичном хосте [ссылка](http://45.145.64.194/) (хотя без доменного имени и ссл-соединения, но это не входила в т/з)

## Эндпоинты:

POST [/auth/register](http://45.145.64.194/auth/register) - регистрация пользователя.  
Пример запроса:

```
{ "email": "test@gmail.com", "password": "123" }
```

или

```
{ "email": "test@gmail.com", "password": "123", "name": "Имя" }
```

возвращает нового пользователя.

POST [/auth/login](http://45.145.64.194/auth/login) - аутентификация пользователя.  
Пример запроса:

```
{ "email": "test@gmail.com", "password": "123" }
```

возвращает токены.

POST [/auth/refresh-token](http://45.145.64.194/auth/refresh-token) - принимает в хедоре `authorization` рефреш токен и если он валидный возвращает новую партию токенов

POST [/posts](http://45.145.64.194/posts) - создание поста.  
Пример запроса:

```
{ "content": "Содержимое поста в текстовом виде", "file": файл, которого мы хотим прикрепить к постпу } - тип запроса - форм/дата
```

возвращает текст: `Post has been created`.  
Касаемо сохранения файла, он сохраняется локально но не в бд, мог сделать и сохранение в бд но это крайне редкая практика поэтому ограничился на сохранении локально (как никому из нас не секрет, обычно файлы хранятся в облачных сервисах). Взаимодействия с файлами кроме их создания отсутствует (но можно добавить по мере нужды).

POST [/posts/:postId](http://45.145.64.194/posts) - изменение поста. Пользователь может изменить только свой пост.  
Пример запроса:

```
{ "content": "Данные были изменены" }
```

возвращает текст: `Post has been updated`

DELETE [/posts/:postId](http://45.145.64.194/posts) - удаляет поста по айди и доступен только авторизованным пользователям, и можно удалить только своего поста

GET [/posts](http://45.145.64.194/posts) - возвращает посты но только свои и эндпоинт доступен только авторизованным пользователям. Также можно пагинировать добавив в конце `?page=число` по-умолчанию отображается первая страница

GET [/posts/all](http://45.145.64.194/posts/all) - возвращает все посты всех пользователей и доступен всем, также и тут можно пагинировать (эндпоинт сделан с целью просмотра всех постов, без ограничения)
