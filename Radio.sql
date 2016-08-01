-- phpMyAdmin SQL Dump
-- version 4.4.11
-- http://www.phpmyadmin.net
--
-- Хост: 127.0.0.1
-- Время создания: Авг 01 2016 г., 16:24
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
-- Структура таблицы `Albums`
--

CREATE TABLE IF NOT EXISTS `Albums` (
  `id` varchar(36) NOT NULL,
  `WeekNumber` int(11) NOT NULL,
  `BandName` varchar(200) CHARACTER SET utf8 NOT NULL,
  `AlbumName` varchar(200) CHARACTER SET utf8 NOT NULL,
  `Genres` varchar(200) CHARACTER SET utf8 DEFAULT NULL,
  `Year` varchar(20) DEFAULT NULL,
  `preView` mediumtext CHARACTER SET utf8 NOT NULL,
  `mainText` longtext CHARACTER SET utf8 NOT NULL,
  `ImgName` varchar(200) CHARACTER SET utf8 NOT NULL,
  `dateCreate` datetime NOT NULL,
  `IsVisible` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Дамп данных таблицы `Albums`
--

INSERT INTO `Albums` (`id`, `WeekNumber`, `BandName`, `AlbumName`, `Genres`, `Year`, `preView`, `mainText`, `ImgName`, `dateCreate`, `IsVisible`) VALUES
('059d9937-e12d-397c-d93b-892aa7cfdaae', 1630, 'SunSay', 'SunSay.jpg SunSay.jpg SunSay.jpg', 'Ragy', '2011', 'PrevText PrevText PrevText PrevText PrevText Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'PrevText PrevText PrevText PrevText PrevText Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'SunSay.jpg', '2016-07-31 16:10:49', 1),
('52ab624d-61d4-1c23-c3f4-f2952feeef01', 1630, 'The Killers', 'All These Things That I''ve Done', 'Indy Rock', '2014', 'PrevText PrevText PrevText PrevText PrevText Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'PrevText PrevText PrevText PrevText PrevText Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.', 'killers.jpg', '2016-07-31 16:09:21', 1),
('7d830491-bed6-8535-ef46-18b97752b809', 1630, 'МоиРакетыВверх', 'Flow', 'Russian Indy Rock, Brit Pop', '2005', 'МоиРакетыВверх.jpgМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpgМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg', 'МоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpgМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpgМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg\r\nМоиРакетыВверх.jpg', 'МоиРакетыВверх.jpg', '2016-07-31 16:03:52', 0),
('8719f19a-1156-396c-392d-ef221c56f2be', 1630, 'Nofx!', 'Let baby it''s a triple Rockk!', 'панк рок!', '2006', '1. Белые розы\r\n2. фдфдф\r\nМного разного русского текста и картиноок\r\nМного разного русского текста и картиноок', '1. Белые розы\r\n2. фдфдф\r\n', 'nofx.jpg', '2016-07-31 15:53:39', 1),
('fc835591-afc6-c29e-043f-429d8ea16181', 1630, 'Sum41', 'chuck', 'punk', '2008', '123', '123123123123123\r\n123\r\n12\r\n3\r\n123\r\n12\r\n3\r\n123\r\n\r\n123\r\n12\r\n3\r\n123\r\nsdf;fksdl;fjljsagjja dfklg\r\n]dfs [\r\ng [dfhk; iifhd iogiodfs jg\r\nsdf g]dfsfgk dfsig hisdihdiufhsuidfsuhudfshsgdofsgkoodfskgkgsdflmgopserg;ldfsjgjsrepugdfsgiubserigjds;jfglkndfsogihserjgdsfjigstioergsdi', 'sum-41-chuck.jpg', '2016-07-31 16:07:19', 1);

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
-- Индексы таблицы `Albums`
--
ALTER TABLE `Albums`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`),
  ADD KEY `weekNumber` (`WeekNumber`),
  ADD KEY `weekNumber_2` (`WeekNumber`);

--
-- Индексы таблицы `Ratings`
--
ALTER TABLE `Ratings`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `id` (`id`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
