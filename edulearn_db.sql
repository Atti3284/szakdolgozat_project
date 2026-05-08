-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Máj 08. 14:22
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
(1, 'React alapok PHP-val', 'Saját Magad', 'A_TE_FIREBASE_UID-D', 1, 'bg-green-500', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400'),
(2, 'Szakdolgozat Projekt', 'AI Mentor', NULL, 1, 'bg-indigo-500', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=400'),
(3, 'Bevezetés a Mesterséges Intelligenciába', 'Dr. Kovács Antal', NULL, 1240, 'bg-purple-600', 'https://images.unsplash.com/photo-1677442136019-21780ecad995'),
(4, 'Modern Webfejlesztés React alapokon', 'Szabó Bence', NULL, 850, 'bg-cyan-500', 'https://images.unsplash.com/photo-1633356122544-f134324a6cee'),
(5, 'UX/UI Design Alapelvek', 'Németh Zsófia', NULL, 2100, 'bg-pink-500', 'https://images.unsplash.com/photo-1586717791821-3f44a563dc4c'),
(6, 'Adatbázis tervezés és SQL haladóknak', 'Varga László', NULL, 560, 'bg-indigo-700', 'https://images.unsplash.com/photo-1544383023-53fca3936a2e'),
(7, 'Python programozás az alapoktól', 'Tóth Eszter', NULL, 3400, 'bg-yellow-500', 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5'),
(8, 'Kiberbiztonság a gyakorlatban', 'Fekete Péter', NULL, 920, 'bg-red-600', 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b'),
(9, 'Digitális Marketing Stratégiák', 'Kiss Dóra', NULL, 1100, 'bg-emerald-500', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f'),
(10, 'Teszt Project', 'Ecsedi Béla', '6mxfiQeLe4a4tslG2Ka423DA9fi1', 0, 'bg-blue-600', NULL),
(11, 'Masodik Teszt', 'Ecsedi Béla', '6mxfiQeLe4a4tslG2Ka423DA9fi1', 0, 'bg-purple-600', NULL);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `enrollments`
--
-- Létrehozva: 2026. Ápr 16. 10:01
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
(1, 'v9Tyym7ZwUUJjcdU4EraBsSBOr02', 1, '2026-04-16 09:31:35', 'active', '2026-04-20 18:11:48'),
(2, 'v9Tyym7ZwUUJjcdU4EraBsSBOr02', 2, '2026-04-16 09:31:43', 'active', '2026-04-16 10:01:43'),
(6, 'v9Tyym7ZwUUJjcdU4EraBsSBOr02', 3, '2026-04-16 12:37:46', 'active', '2026-04-16 12:37:46'),
(10, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 1, '2026-04-16 21:07:46', 'active', '2026-05-06 19:50:40'),
(11, '40EhY9fwUnWXuM3fjsEVZY6KrAf2', 2, '2026-04-20 17:14:55', 'active', '2026-04-20 17:14:55'),
(12, '40EhY9fwUnWXuM3fjsEVZY6KrAf2', 1, '2026-04-20 17:14:59', 'active', '2026-04-20 18:10:22'),
(13, '40EhY9fwUnWXuM3fjsEVZY6KrAf2', 3, '2026-04-20 17:15:06', 'active', '2026-04-20 17:15:06'),
(14, 'v9Tyym7ZwUUJjcdU4EraBsSBOr02', 7, '2026-04-20 18:18:17', 'active', '2026-04-20 18:18:17'),
(15, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 7, '2026-04-20 18:18:47', 'active', '2026-04-20 18:18:47'),
(16, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 2, '2026-04-20 18:59:55', 'active', '2026-04-20 18:59:55'),
(17, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 10, '2026-05-06 19:24:16', 'active', '2026-05-06 19:24:16');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `lessons`
--
-- Létrehozva: 2026. Máj 08. 12:14
-- Utolsó frissítés: 2026. Máj 08. 12:16
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
(1, 1, 'Introduction to HTML', NULL, '12 min', 1),
(2, 1, 'CSS Fundamentals', NULL, '18 min', 0),
(3, 1, 'JavaScript Basics', NULL, '25 min', 0),
(4, 10, 'teszt', 'ez egy teszt szöveg akar lenni', NULL, 0),
(5, 10, 'teszt2', 'ez a szöveg a második teszthez tartozik amit mindjárt kitölök{}&{#@', NULL, 0);

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
(8, '40EhY9fwUnWXuM3fjsEVZY6KrAf2', 1, '2026-04-20 17:15:23'),
(9, '40EhY9fwUnWXuM3fjsEVZY6KrAf2', 2, '2026-04-20 17:15:25'),
(31, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 1, '2026-04-20 19:05:16'),
(33, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 2, '2026-04-20 20:32:42'),
(43, 'UAaZ0VnVmIhJejkx3u7WjaDuRXE3', 3, '2026-05-06 19:50:40');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT a táblához `lessons`
--
ALTER TABLE `lessons`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `user_progress`
--
ALTER TABLE `user_progress`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=44;

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
