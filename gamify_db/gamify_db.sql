-- MySQL dump 10.13  Distrib 8.0.45, for Win64 (x86_64)
--
-- Host: localhost    Database: gamify_db
-- ------------------------------------------------------
-- Server version	8.0.45

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `game_keys`
--

DROP TABLE IF EXISTS `game_keys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_keys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `game_id` int unsigned NOT NULL,
  `license_key` varchar(255) NOT NULL,
  `status` varchar(50) NOT NULL DEFAULT 'available',
  PRIMARY KEY (`id`),
  UNIQUE KEY `license_key` (`license_key`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `game_keys_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_keys`
--

LOCK TABLES `game_keys` WRITE;
/*!40000 ALTER TABLE `game_keys` DISABLE KEYS */;
/*!40000 ALTER TABLE `game_keys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `slug` varchar(255) NOT NULL,
  `genre` varchar(100) DEFAULT NULL,
  `tag` varchar(100) DEFAULT NULL,
  `description` text,
  `release_date` date DEFAULT NULL,
  `developer_name` varchar(255) DEFAULT NULL,
  `base_price` decimal(6,2) NOT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=30 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Assassin\'s Creed Shadows','ac-shadows','Action role-playing',NULL,'Assassin\'s Creed Shadows is an action role-playing game with an emphasis on each of its two playable characters\' set of unique skills. It is developed on an upgraded version of Anvil, using dynamic lighting and environmental interactions. Improvements include the addition of breakable objects and the ability to manipulate shadows and use a grappling hook for parkour. The game\'s open world, whose size is comparable to that of Assassin\'s Creed Origins, progresses through seasons which can affect gameplay. Missions are non-linear, encouraging players to track and eliminate targets freely.','2025-03-20','Ubisoft Quebec',69.80,'acshadows.jpg'),(2,'Alien: Isolation','alien-isolation','Action-adventure, stealth, survival horror',NULL,'Alien: Isolation is a single-player action-adventure game with an emphasis on stealth and survival horror. The player controls Amanda Ripley from a first-person perspective, and must explore a space station and complete mission objectives to progress forward in the story while avoiding, outsmarting, and defeating enemies. Specific objectives vary across each of the nineteen missions, but can range from activating computers, talking to NPCs, collecting certain items or reaching specific areas. The player can run, climb ladders, sneak into vents, crouch behind objects to break the line of sight with enemies, and peek over or lean around for a safe view. The player also has the ability to go under tables or inside empty lockers and cabinets to hide from enemies.','2014-10-07','Creative Assembly',39.99,'alienisolation.jpg'),(3,'Atomic Heart','atomic-heart','First-person shooter',NULL,'Atomic Heart takes place on the grounds of Facility 3826, the Soviet Union\'s foremost scientific research hub in an alternate history 1955, located in the Kazakh SSR. In 1936, scientist Dmitry Sechenov developed a liquidized programmable module called the Polymer, sparking massive technological breakthroughs in the fields of cold fusion and robotics in the USSR, freeing much of the populace from manual labor. When World War II broke out, the Soviets quickly gained the upper hand, but just before Nazi Germany was defeated in 1942, the Nazis secretly unleashed the Brown Plague virus, leaving millions dead and creating an international demand for Soviet robots to compensate for the resulting worker shortage. As part of the Soviet Union\'s post-war reconstruction program, Dr. Sechenov created a wireless, networked artificial intelligence called \'Kollektiv 1.0\' that linked his robots together for greater efficiency.','2023-02-21','Mundfish',49.60,'atomicheart.jpg'),(4,'The Blood of Dawnwalker','the-blood-of-dawnwalker','Action role-playing','Preorder','The Blood of Dawnwalker is an upcoming action role-playing game developed by Rebel Wolves and published by Bandai Namco Entertainment. It is set in 14th-century medieval Southeast Europe. The game was announced in January 2025. It is scheduled to release for the PlayStation 5, Windows and Xbox Series X/S on September 3, 2026. Konrad Tomaszkiewicz directed the game, after working on The Witcher 3: Wild Hunt.','2026-09-03','Rebel Wolves',69.99,'blooddawnwalker.jpg'),(5,'Call of Duty: Black Ops 7','call-of-duty-black-ops-7','First-person shooter',NULL,'Call of Duty: Black Ops 7—like its predecessor, Call of Duty: Black Ops 6 (2024)—is a first-person shooter. Depending on the game mode selected, players use near-future military equipment, such as weapons, \'field upgrades\', and \'scorestreaks\', to combat AI opponents, other human players, or undead creatures. Players can traverse a level/map omnidirectionally, and can perform \'wall jumps\' off of select walls; in a change from Black Ops 6, the \'Tactical\' Sprint ability, which grants a limited boost of speed allowing faster movement than the base sprint, has been removed from the core movement, but is accessible as an in-game perk.\r\n','2025-11-14','Treyarch, Raven Software',79.99,'codbo7.jpg'),(6,'Crimson Desert','crimson-desert','Action-adventure',NULL,'Crimson Desert is an action-adventure game set in the open-world fictional continent of Pywel, a high fantasy world affected by multiple conflicts and mysterious forces. Players initially control Kliff, a member of the Greymanes, as he navigates a landscape populated by rival factions and dangerous creatures. The game features a dynamic combat system powered by the proprietary BlackSpace Engine, combining combo attacks, environmental traversal, and magic. Players can engage in horseback combat, face large-scale bosses such as dragons, and utilize a wide array of weapons and abilities enhanced with elemental effects. Pywel\'s open world offers a variety of activities including fishing, cooking, crafting, and hunting, allowing players to engage with the world beyond battles. The developers intended the world to be seamless and immersive, encouraging exploration and interaction with its inhabitants and environments.\r\n','2026-03-19','Pearl Abyss',69.99,'crimsondesert.jpg'),(7,'Cyberpunk 2077','cyberpunk-2077','Action role-playing',NULL,'Cyberpunk 2077 is a 2020 action role-playing game developed by CD Projekt Red and published by CD Projekt. Based on Mike Pondsmith\'s Cyberpunk tabletop game series, the plot is set in the fictional metropolis of Night City in California, within the dystopian Cyberpunk universe. The player assumes the role of V (voiced by Gavin Drea or Cherami Leigh depending on the player character\'s gender), a mercenary who gets reluctantly imbued with a cybernetic \'biochip\' containing an engram of legendary rockstar and terrorist Johnny Silverhand (voiced by Keanu Reeves). As Johnny\'s consciousness begins overwriting V\'s own, the two must work together to separate from each other and save V\'s life.\r\n','2020-12-10','CD Projekt Red',59.99,'cyberpunk.jpg'),(8,'Days Gone','days-gone','Action-adventure',NULL,'Days Gone is a 2019 action-adventure video game developed by Bend Studio and published by Sony Interactive Entertainment. It is set in post-apocalyptic Oregon two years after the start of a pandemic that turned a portion of humanity into vicious zombie-like creatures. Former outlaw biker Deacon St. John discovers his wife Sarah, having been assumed dead, may still be alive and goes on a quest to find her. The game is played from a third-person perspective in which the player can explore an open world environment. Players can use firearms, melee weapons, and improvised weapons, and can use stealth to defend themselves against enemies. A major game mechanic is Deacon\'s motorcycle, which is used as the player character\'s main mode of transportation. The enemies, known as \'Freakers\' in the game, can congregate to form a large horde to chase down Deacon.\r\n','2019-04-26','Bend Studio',39.99,'daysgone.jpg'),(9,'Death Stranding 2: On the Beach','death-stranding-2-on-the-beach','Action-adventure',NULL,'Death Stranding 2: On the Beach is a 2025 action-adventure game written, produced, designed, and directed by Hideo Kojima, developed by Kojima Productions and published by Sony Interactive Entertainment. It is the sequel to Death Stranding and the second game from Kojima Productions as an independent entity, as well as the studio\'s second collaboration with Sony. On the Beach features the previous game\'s central characters, including Sam, Fragile, and Higgs, reprised by Norman Reedus, Léa Seydoux, and Troy Baker, respectively. They are joined by a cast consisting of Elle Fanning, Shioli Kutsuna, Luca Marinelli, Alastair Duncan, Alissa Jung, Debra Wilson, and Tommie Earl Jenkins, as well as the likenesses of filmmakers George Miller, Fatih Akin, Guillermo del Toro, and Nicolas Winding Refn, the latter two returning from the first game.\r\n','2026-03-19','Kojima Productions',79.99,'deathstranding2.jpg'),(10,'Devil May Cry 5','devil-may-cry-5','Action-adventure, hack and slash',NULL,'Devil May Cry 5 is a 2019 action-adventure game developed and published by Capcom. The game is the sixth installment overall and the fifth mainline installment in the Devil May Cry series. The plot follows returning protagonists Nero and Dante as they are hired by a mysterious stranger named V to stop the Demon King Urizen. Players control Nero, Dante and V, who each feature a different playstyle.\r\n','2019-03-08','Capcom',29.99,'devilmaycry5.jpg'),(11,'Diablo IV','diablo-4','Action role-playing, hack and slash',NULL,'Diablo IV is a 2023 action role-playing game developed and published by Blizzard Entertainment. It is the fourth main installment in the Diablo series. Announced at BlizzCon 2019, the game was released on June 5, 2023 for the PlayStation 4 and PlayStation 5, Xbox One and Xbox Series X and S, and Microsoft Windows. Players create a character from one of eight playable classes—Barbarian, Sorcerer, Druid, Rogue, Necromancer, Spiritborn, Paladin, or Warlock—and use their skills to complete quests through combat.\r\n','2023-06-05','Blizzard Albany, Blizzard Team 3',49.99,'diablo4.jpg'),(12,'Directive 8020','directive-8020','Single-player, multiplayer','Preorder','Directive 8020 is an upcoming interactive drama and survival horror video game developed and published by Supermassive Games. It is the fifth game in The Dark Pictures Anthology. The game features a multilinear plot in which decisions can significantly alter the trajectory of the story and change the relationships between the five playable protagonists; some lead to their permanent deaths. The game introduces a feature called Turning Points, which allows players to rewind to a pivotal moment or decision. In Directive 8020, a colony ship called Cassiopeia crash lands on Tau Ceti f, a planet that is 12 light-years from Earth where the crew must try to survive a shapeshifting alien threat. Lashana Lynch, who plays astronaut and co-pilot of the Cassiopeia, Brianna Young, is being marketed as the game\'s leading actress. Directive 8020 is scheduled to be released for PlayStation 5, Windows, and Xbox Series X/S on 31 May 2026.\r\n','2026-05-31','Supermassive Games',49.99,'directive8020.jpg'),(13,'Elden Ring','elden-ring','Single-player, multiplayer',NULL,'Elden Ring is a 2022 action role-playing game directed by Hidetaka Miyazaki with worldbuilding provided by the American fantasy writer George R. R. Martin. Developed by FromSoftware and published by Bandai Namco Entertainment, it was first released on February 25, 2022 for PlayStation 4, PlayStation 5, Windows, Xbox One and Xbox Series X/S. Set in the Lands Between, players control a customizable player character on a quest to repair the Elden Ring and become the new Elden Lord.\r\n','2022-02-25','FromSoftware',59.99,'eldenring.jpg'),(14,'Elden Ring Nightreign','elden-ring-nightreing','Action role-playing, Roguelike',NULL,'Elden Ring Nightreign is a 2025 roguelike action role-playing game developed by FromSoftware and published by Bandai Namco Entertainment. The game is a spin-off to Elden Ring, using many of its features and gameplay elements, and focuses on roguelike and cooperative mechanics. Players control Nightfarers on a quest to dispel the reign of night. It was revealed at The Game Awards 2024, and was released for the PlayStation 4, PlayStation 5, Windows, Xbox One, and Xbox Series X/S on May 30, 2025. Upon release, it topped the May sales charts across all platforms, received generally positive reviews and has sold 5 million units.\r\n','2025-05-30','FromSoftware',39.99,'eldenringnightreign.jpg'),(15,'Escape from Tarkov','escape-from-tarkov','First-person shooter',NULL,'Escape from Tarkov is a multiplayer first-person tactical extraction shooter video game developed by Battlestate Games for Microsoft Windows. The game is set in the fictional Norvinsk region in northwestern Russia, where a war is taking place between two private military companies (United Security \'USEC\' and the Battle Encounter Assault Regiment \'BEAR\'). Players join matches called \'raids\' in which they fight other players and bots for loot and aim to survive and escape.','2025-11-15','Battlestate Games',49.99,'escapefromtarkov.jpg'),(16,'Forza Horizon 6','forza-horizon-6','Racing','Preorder','Forza Horizon 6 is an upcoming racing game developed by Playground Games and published by Xbox Game Studios. It is the sixth Forza Horizon title, following Forza Horizon 5, and the fourteenth main instalment in the Forza franchise. Set in a fictionalised representation of Japan, it features a stylised version of Tokyo as the game world\'s main city. It is scheduled to be released on 26 May 2026 for players with the Standard or Deluxe edition and 23 May 2026 if the player has purchased the Premium edition. It will release for Windows and Xbox Series X/S, with a release for PlayStation 5 later that year.\r\n','2026-05-26','Playground Games',69.99,'forzahorizon6.jpg'),(17,'God of War Ragnarok','god-of-war-ragnarok','Action-adventure, hack and slash',NULL,'God of War Ragnarök is a 2022 action-adventure game developed by Santa Monica Studio and published by Sony Interactive Entertainment. It was released worldwide on November 9, 2022, for both the PlayStation 4 and PlayStation 5, marking the first cross-generation release in the God of War series, and was released for Windows on September 19, 2024. It is the ninth installment in the series, the 10th chronologically, and the sequel to 2018\'s God of War. Loosely based on Norse mythology, the game is set in mythical ancient Scandinavia and features series protagonist, Kratos, and his now teenage son, Atreus. Concluding the Norse era of the series, the story follows Kratos and Atreus\' efforts to prevent the nine realms from being destroyed by Ragnarök, the eschatological event which is central to Norse mythology and was foretold to happen in the previous game after Kratos killed the Aesir god Baldur.','2024-09-19','Santa Monica Studio',59.99,'godofwarragnarok.jpg'),(18,'Gotham Knights','gotham-knights','Action role-playing',NULL,'Gotham Knights is a 2022 action role-playing game developed by WB Games Montréal and published by Warner Bros. Games. Inspired by the Batman: Gotham Knights comic series and based on the DC Comics character Batman and his supporting cast, the game focuses on the characters Nightwing, Batgirl, Robin, and Red Hood as they attempt to restore justice to Gotham City during a period of decline in the immediate aftermath of Batman\'s death. While investigating the events that led to their mentor\'s demise, the heroes become embroiled in an ancient conflict between two secret organizations fighting for control of Gotham: the Court of Owls and the League of Shadows.\r\n\r\n','2022-10-21','WB Games Montréal',59.99,'gothamknights.jpg'),(19,'Hogwarts Legacy','hogwarts-legacy','Action role-playing',NULL,'Hogwarts Legacy is a 2023 action role-playing video game developed by Avalanche Software and published by Warner Bros. Games under its Portkey Games label. It is part of the Wizarding World franchise, taking place a century before the Harry Potter novels. Players control a student enrolled at the magical Hogwarts School of Witchcraft and Wizardry who attends classes, learns spells, and explores Hogwarts Castle and its surroundings. With the assistance of fellow students and professors, the protagonist embarks on a journey to uncover an ancient secret hidden within the wizarding world.\r\n','2023-02-10','Avalanche Software',59.99,'hogwartslegacy.jpg'),(20,'Lies of P','lies-of-p','Action role-playing',NULL,'Lies of P is a 2023 action role-playing game developed by Neowiz and Round8 Studio and published by Neowiz. The story is loosely based on the 1883 Italian novel The Adventures of Pinocchio by Carlo Collodi, to whom it is dedicated, the game is a Soulslike set in the fictional city of Krat, inspired by the Belle Époque. The titular \'P\' refers to protagonist Pinocchio, whom the player controls from a third-person perspective, and is one of the automaton-like \'Puppets\' central to the life and industry of Krat.\r\n','2023-09-18','Neowiz, Round8 Studio',59.99,'liesofp.jpg'),(21,'METAL GEAR SOLID DELTA: SNAKE EATER','metal-gear-solid-delta-snake-eater','Action-adventure, stealth','Preorder','Metal Gear Solid Delta: Snake Eater is an upcoming 2026 action-adventure stealth game developed and published by Konami. It is a remake of the 2004 game Metal Gear Solid 3: Snake Eater, the fifth main entry in the Metal Gear franchise and the first chronological game overall. Set in 1964, the game follows a FOX operative codenamed Naked Snake, who must rescue a prominent Soviet rocket scientist and sabotage the Soviet nuclear superweapon Shagohod, while clearing the United States from Soviet suspicion amid Cold War tensions by confronting his former mentor, The Boss, who has defected to the Soviets.\n','2026-08-28','Konami',79.99,'metalgearsoliddelta.jpg'),(22,'Metaphor: ReFantazio','metaphor-refantazio','Role-playing',NULL,'Metaphor: ReFantazio is a 2024 role-playing video game developed by Studio Zero and published by Sega. Metaphor: ReFantazio was first announced under the working title Project Re:Fantasy in December 2016, with no further information revealed until 2023, and was released for PlayStation 4, PlayStation 5, Windows, and Xbox Series X/S by Atlus in Japan and by Sega internationally. The game is set in the United Kingdom of Euchronia, a medieval fantasy realm mirroring the contemporary real world, after the assassination of its former King. Years earlier, an assassination attempt on the Prince resulted in him being cursed and falling into a long slumber. The protagonist, Will, an orphaned boy of the magic-wielding Elda tribe and the Prince\'s childhood friend, participates in the Royal Tournament, held to decide the throne\'s successor, journeying across Euchronia to rally support from its people while searching for a way to lift the curse.\n','2024-10-11','Studio Zero (Atlus)',69.99,'metaphor.jpg'),(23,'Nier: Automata','nier-automata','Action role-playing',NULL,'NieR:Automata is a critically acclaimed action-RPG featuring full English voice acting and text, renowned for its fast-paced combat and deep narrative. Players control androids 2B, 9S, and A2 in a post-apocalyptic war, available on PS4, Xbox One, Nintendo Switch, and PC (Steam). The English dub is generally praised for quality, making it a great choice for players.','2017-02-23','PlatinumGames',39.99,'nierautamata.jpg'),(24,'Nioh 3','nioh-3','Action role-playing','Preorder','Nioh 3 is an action role-playing video game developed by Team Ninja and published by Koei Tecmo. Although its predecessor Nioh 2 (2020) acted as a prequel to the original game, the third installment takes place after all of the events of the previous games.','2026-06-12','Team Ninja',79.99,'nioh3.jpg'),(25,'Persona 3','persona-3','Role-playing',NULL,'In Persona 3, the player assumes the role of a high school student who joins the \'Specialized Extracurricular Execution Squad\' (SEES), a group of students investigating a temporal anomaly known as the \'Dark Hour\', during which its members can enter Tartarus, a tower containing monsters called Shadows. They battle the Shadows using a physical manifestation of their psyche called a Persona, which they summon by firing a gun-like object called an \'Evoker\' at their head. Persona 3 incorporates elements of role-playing and simulation games, as the game\'s protagonist progresses day by day through a school year and forms relationships that improve their Personas\' strength in battle. ','2026-05-28','Atlus',59.99,'persona3.jpg'),(26,'Pragmata','pragmata','	Action-adventure','Preorder','Pragmata is an action-adventure played from a third-person perspective. The player can control Hugh and Diana at the same time, as they look for a way to escape a crumbling lunar research station while fighting off hostile robots controlled by a malevolent AI. Hugh wields a variety of energy and electricity-based weapons and can utilize a hip-mounted jetpack to dodge attacks and reach distant areas. ','2026-06-20','	Capcom',59.99,'pragmata.jpg'),(27,'Red Dead Redemption 2','red-dead-redemption-2','Action-adventure',NULL,'Red Dead Redemption 2 is action-adventure game developed and published by Rockstar Games. The game is the third entry in the Red Dead series and a prequel to the 2010 game Red Dead Redemption. The story is set in a fictionalized representation of the United States in 1899 and follows the exploits of Arthur Morgan, an outlaw and member of the Van der Linde gang, who must face the challenges of a declining Wild West, while attempting to survive against government forces, rival gangs, and other adversaries. The game is presented through first- and third-person perspectives, and the player may freely roam its interactive open world. Gameplay elements include shootouts, robberies, hunting, horseback riding, interacting with non-player characters, and maintaining the character\'s honor rating through moral choices and deeds. A bounty system governs the response of law enforcement and bounty hunters to crimes committed by the player. ','2019-10-20','	Rockstar Games',59.99,'reddeadredemption2.jpg'),(28,'Resident Evil Requiem','resident-evil-requiem','	Survival horror',NULL,'Resident Evil Requiem is a 2026 survival horror game developed and published by Capcom. It is a major installment in the Resident Evil series, following Resident Evil Village (2021).It features a new playable character, FBI analyst Grace Ashcroft, who investigates a series of mysterious deaths involving the survivors of the Raccoon City incident with the aid of federal agent and returning protagonist Leon S. Kennedy. ','2026-02-17','	Capcom',69.99,'requiem.jpg'),(29,'Stalker 2','stalker-2','First-person shooter, Survival horror',NULL,'S.T.A.L.K.E.R. 2: Heart of Chornobyl is a first-person shooter with survival horror elements. It takes place in the post-apocalyptic Chernobyl exclusion zone around the Chernobyl Nuclear Power Plant. The game world is divided into several territories, some of which are initially inaccessible','2020-06-10','GSC Game World',59.99,'stalker2.jpg');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_items`
--

DROP TABLE IF EXISTS `order_items`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_items` (
  `id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `game_key_id` int NOT NULL,
  `sold_price` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `game_key_id` (`game_key_id`),
  KEY `order_id` (`order_id`),
  CONSTRAINT `order_items_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `order_items_ibfk_2` FOREIGN KEY (`game_key_id`) REFERENCES `game_keys` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_items`
--

LOCK TABLES `order_items` WRITE;
/*!40000 ALTER TABLE `order_items` DISABLE KEYS */;
/*!40000 ALTER TABLE `order_items` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `email` varchar(255) NOT NULL,
  `total_amount` decimal(10,2) NOT NULL,
  `coupon_discount_amount` decimal(10,2) DEFAULT '0.00',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-07 11:50:49
