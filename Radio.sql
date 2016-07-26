-- phpMyAdmin SQL Dump
-- version 4.4.11
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Июл 26 2016 г., 20:12
-- Версия сервера: 5.6.25
-- Версия PHP: 5.3.29

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- База данных: `Radio`
--

-- --------------------------------------------------------

--
-- Структура таблицы `Ratings`
--

CREATE TABLE IF NOT EXISTS `Ratings` (
  `id` varchar(36) NOT NULL,
  `autor` varchar(200) DEFAULT NULL,
  `song` varchar(200) DEFAULT NULL,
  `album` varchar(200) DEFAULT NULL,
  `dateCreate` datetime NOT NULL,
  `rate` int(11) NOT NULL,
  `userTempId` varchar(18) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `Ratings`
--

INSERT INTO `Ratings` (`id`, `autor`, `song`, `album`, `dateCreate`, `rate`, `userTempId`) VALUES
('1', 'test', 'song_test', 'album_test', '2016-07-26 23:08:59', 9, '123456789012345678');

--
-- Индексы сохранённых таблиц
--

--
-- Индексы таблицы `Ratings`
--
ALTER TABLE `Ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
