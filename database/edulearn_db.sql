-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Máj 09. 11:34
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `edulearn_db`
--
CREATE DATABASE IF NOT EXISTS `edulearn_db` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `edulearn_db`;

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `courses`
--
-- Létrehozva: 2026. Máj 06. 10:21
-- Utolsó frissítés: 2026. Máj 09. 09:18
--

DROP TABLE IF EXISTS `courses`;
CREATE TABLE `courses` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `instructor` varchar(255) NOT NULL,
  `instructor_uid` varchar(255) DEFAULT NULL,
  `students` int(11) DEFAULT 0,
  `color` varchar(50) DEFAULT NULL,
  `imageUrl` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- TÁBLA KAPCSOLATAI `courses`:
--

--
-- A tábla adatainak kiíratása `courses`
--

INSERT INTO `courses` (`id`, `title`, `instructor`, `instructor_uid`, `students`, `color`, `imageUrl`) VALUES
(10, 'Teszt Project', 'Ecsedi Béla', '6mxfiQeLe4a4tslG2Ka423DA9fi1', 0, 'bg-blue-600', NULL),
(11, 'Masodik Teszt', 'Ecsedi Béla', '6mxfiQeLe4a4tslG2Ka423DA9fi1', 0, 'bg-purple-600', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `enrollments`
--
-- Létrehozva: 2026. Ápr 16. 10:01
-- Utolsó frissítés: 2026. Máj 09. 09:19
--

DROP TABLE IF EXISTS `enrollments`;
CREATE TABLE `enrollments` (
  `id` int(11) NOT NULL,
  `user_uid` varchar(128) DEFAULT NULL,
  `course_id` int(11) DEFAULT NULL,
  `enrolled_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `status` enum('active','completed') DEFAULT 'active',
  `last_activity` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- TÁBLA KAPCSOLATAI `enrollments`:
--   `course_id`
--       `courses` -> `id`
--   `course_id`
--       `courses` -> `id`
--   `user_uid`
--       `users` -> `firebase_uid`
--

--
-- A tábla adatainak kiíratása `enrollments`
--

INSERT INTO `enrollments` (`id`, `user_uid`, `course_id`, `enrolled_at`, `status`, `last_activity`) VALUES
(19, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 10, '2026-05-09 09:19:20', 'active', '2026-05-09 09:19:26');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lessons`
--
-- Létrehozva: 2026. Máj 08. 12:14
-- Utolsó frissítés: 2026. Máj 09. 09:17
--

DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `id` int(11) NOT NULL,
  `course_id` int(11) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `content` text DEFAULT NULL,
  `duration` varchar(50) DEFAULT NULL,
  `completed` tinyint(1) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- TÁBLA KAPCSOLATAI `lessons`:
--   `course_id`
--       `courses` -> `id`
--

--
-- A tábla adatainak kiíratása `lessons`
--

INSERT INTO `lessons` (`id`, `course_id`, `title`, `content`, `duration`, `completed`) VALUES
(4, 10, 'teszt', 'ez egy teszt szöveg akar lenni', NULL, 0);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--
-- Létrehozva: 2026. Ápr 10. 10:04
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `firebase_uid` varchar(128) DEFAULT NULL,
  `username` varchar(50) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `role` enum('guest','student','teacher') DEFAULT 'student',
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- TÁBLA KAPCSOLATAI `users`:
--

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`id`, `firebase_uid`, `username`, `email`, `full_name`, `role`, `avatar_url`, `created_at`) VALUES
(2, 'v9Tyym7ZwUUJjcdU4EraBsSBOr02', NULL, 'teszt2@gmail.com', 'Endre', 'student', NULL, '2026-04-10 18:56:08'),
(3, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', NULL, 'teszt1@gmail.com', 'Bika János', 'student', NULL, '2026-04-16 21:07:16'),
(4, '40EhY9fwUnWXuM3fjsEVZY6KrAf2', NULL, 'teszt3@gmail.com', 'Haja Olajos', 'student', NULL, '2026-04-20 17:14:41'),
(5, '6mxfiQeLe4a4tslG2Ka423DA9fi1', NULL, 'teszt4@gmail.com', 'Ecsedi Béla', 'teacher', NULL, '2026-05-06 19:09:23');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `user_progress`
--
-- Létrehozva: 2026. Ápr 20. 16:46
-- Utolsó frissítés: 2026. Máj 09. 09:19
--

DROP TABLE IF EXISTS `user_progress`;
CREATE TABLE `user_progress` (
  `id` int(11) NOT NULL,
  `user_uid` varchar(128) NOT NULL,
  `lesson_id` int(11) NOT NULL,
  `completed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- TÁBLA KAPCSOLATAI `user_progress`:
--   `user_uid`
--       `users` -> `firebase_uid`
--   `lesson_id`
--       `lessons` -> `id`
--

--
-- A tábla adatainak kiíratása `user_progress`
--

INSERT INTO `user_progress` (`id`, `user_uid`, `lesson_id`, `completed_at`) VALUES
(48, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 4, '2026-05-09 09:19:26');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `courses`
--
ALTER TABLE `courses`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `enrollments`
--
ALTER TABLE `enrollments`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_enrollment` (`user_uid`,`course_id`),
  ADD KEY `fk_course_enrollment` (`course_id`);

--
-- A tábla indexei `lessons`
--
ALTER TABLE `lessons`
  ADD PRIMARY KEY (`id`),
  ADD KEY `course_id` (`course_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`),
  ADD UNIQUE KEY `firebase_uid` (`firebase_uid`);

--
-- A tábla indexei `user_progress`
--
ALTER TABLE `user_progress`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_progress` (`user_uid`,`lesson_id`),
  ADD KEY `lesson_id` (`lesson_id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `courses`
--
ALTER TABLE `courses`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT a táblához `enrollments`
--
ALTER TABLE `enrollments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT a táblához `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=49;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `enrollments`
--
ALTER TABLE `enrollments`
  ADD CONSTRAINT `enrollments_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`),
  ADD CONSTRAINT `fk_course_enrollment` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_user_enrollment` FOREIGN KEY (`user_uid`) REFERENCES `users` (`firebase_uid`) ON DELETE CASCADE;

--
-- Megkötések a táblához `lessons`
--
ALTER TABLE `lessons`
  ADD CONSTRAINT `lessons_ibfk_1` FOREIGN KEY (`course_id`) REFERENCES `courses` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `user_progress`
--
ALTER TABLE `user_progress`
  ADD CONSTRAINT `user_progress_ibfk_1` FOREIGN KEY (`user_uid`) REFERENCES `users` (`firebase_uid`) ON DELETE CASCADE,
  ADD CONSTRAINT `user_progress_ibfk_2` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
