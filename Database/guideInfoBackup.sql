BEGIN TRANSACTION;
CREATE TABLE Course(
            classID INTEGER PRIMARY KEY AUTOINCREMENT,
            deptID INTEGER,
            course INTEGER,
            name TEXT,
            FOREIGN KEY(deptID) REFERENCES Department(deptID));
CREATE TABLE Department(
            deptID INTEGER PRIMARY KEY,
            name TEXT,
            shortName TEXT);
CREATE TABLE Grades(
            gradesID INTEGER PRIMARY KEY AUTOINCREMENT,
            aPercent REAL,
            abPercent REAL,
            bPercent REAL,
            bcPercent REAL,
            cPercent REAL,
            dPercent REAL,
            fPercent REAL,
            iPercent REAL);
CREATE TABLE Map(
            mapID INTEGER PRIMARY KEY,
            name TEXT,
            link TEXT);
INSERT INTO "Map" VALUES(1,'1220 Capitol Ct.','http://maps.wisc.edu//?initObj=0782');
INSERT INTO "Map" VALUES(2,'1410 Engineering Dr.','http://maps.wisc.edu//?initObj=0486');
INSERT INTO "Map" VALUES(3,'1433 Monroe St.','http://maps.wisc.edu//?initObj=1095');
INSERT INTO "Map" VALUES(4,'1610 University Ave.','http://maps.wisc.edu//?initObj=0129');
INSERT INTO "Map" VALUES(5,'1645 Linden Dr.','http://maps.wisc.edu//?initObj=0091');
INSERT INTO "Map" VALUES(6,'1800 University Ave.','http://maps.wisc.edu//?initObj=0113');
INSERT INTO "Map" VALUES(7,'1910 Linden Dr.','http://maps.wisc.edu//?initObj=0103');
INSERT INTO "Map" VALUES(8,'206 Bernard Ct.','http://maps.wisc.edu//?initObj=1082');
INSERT INTO "Map" VALUES(9,'209 N. Brooks St.','http://maps.wisc.edu//?initObj=0788');
INSERT INTO "Map" VALUES(10,'215-217 N. Brooks St.','http://maps.wisc.edu//?initObj=1060');
INSERT INTO "Map" VALUES(11,'21 N. Park St.','http://maps.wisc.edu//?initObj=1078');
INSERT INTO "Map" VALUES(12,'30 N. Mills St.','http://maps.wisc.edu//?initObj=0124');
INSERT INTO "Map" VALUES(13,'432 East Campus Mall','http://maps.wisc.edu//?initObj=0515A');
INSERT INTO "Map" VALUES(14,'445 Henry Mall','http://maps.wisc.edu//?initObj=0102');
INSERT INTO "Map" VALUES(15,'45 N. Charter St.','http://maps.wisc.edu//?initObj=0504');
INSERT INTO "Map" VALUES(16,'502 Herrick Dr.','http://maps.wisc.edu//?initObj=0111');
INSERT INTO "Map" VALUES(17,'711 State St.','http://maps.wisc.edu//?initObj=8122');
INSERT INTO "Map" VALUES(18,'901 University Bay Dr.','http://maps.wisc.edu//?initObj=0547');
INSERT INTO "Map" VALUES(19,'Adams Residence Hall','http://maps.wisc.edu//?initObj=0564');
INSERT INTO "Map" VALUES(20,'Agricultural Bulletin Building','http://maps.wisc.edu//?initObj=0078');
INSERT INTO "Map" VALUES(21,'Agricultural Dean''s Residence','http://maps.wisc.edu//?initObj=0072');
INSERT INTO "Map" VALUES(22,'Agricultural Engineering Building','http://maps.wisc.edu//?initObj=0080');
INSERT INTO "Map" VALUES(23,'Agricultural Engineering Laboratory','http://maps.wisc.edu//?initObj=0099');
INSERT INTO "Map" VALUES(24,'Agricultural Hall','http://maps.wisc.edu//?initObj=0070');
INSERT INTO "Map" VALUES(25,'American Family Children''s Hospital','http://maps.wisc.edu//?initObj=1426');
INSERT INTO "Map" VALUES(26,'Animal Science Building','http://maps.wisc.edu//?initObj=0118');
INSERT INTO "Map" VALUES(27,'Armory and Gymnasium (Red Gym)','http://maps.wisc.edu//?initObj=0020');
INSERT INTO "Map" VALUES(28,'Art Lofts','http://maps.wisc.edu//?initObj=0220');
INSERT INTO "Map" VALUES(29,'Athletics Operations Building','http://maps.wisc.edu//?initObj=0584');
INSERT INTO "Map" VALUES(30,'Atmospheric, Oceanic and Space Sciences Building','http://maps.wisc.edu//?initObj=0156');
INSERT INTO "Map" VALUES(31,'Babcock Hall','http://maps.wisc.edu//?initObj=0106');
INSERT INTO "Map" VALUES(32,'Bardeen Medical Laboratories','http://maps.wisc.edu//?initObj=0451B');
INSERT INTO "Map" VALUES(33,'Barnard Residence Hall','http://maps.wisc.edu//?initObj=0560');
INSERT INTO "Map" VALUES(34,'Bascom Hall','http://maps.wisc.edu//?initObj=0050');
INSERT INTO "Map" VALUES(35,'Below Alumni Center','http://maps.wisc.edu//?initObj=0489');
INSERT INTO "Map" VALUES(36,'Biotron Laboratory','http://maps.wisc.edu//?initObj=0045');
INSERT INTO "Map" VALUES(37,'Birge Hall','http://maps.wisc.edu//?initObj=0054');
INSERT INTO "Map" VALUES(38,'Bock Laboratories','http://maps.wisc.edu//?initObj=0033');
INSERT INTO "Map" VALUES(39,'Bradley Memorial Building','http://maps.wisc.edu//?initObj=0452');
INSERT INTO "Map" VALUES(40,'Bradley Residence Hall','http://maps.wisc.edu//?initObj=0506');
INSERT INTO "Map" VALUES(41,'Brogden Psychology Building','http://maps.wisc.edu//?initObj=0470');
INSERT INTO "Map" VALUES(42,'Camp Randall Sports Center','http://maps.wisc.edu//?initObj=0025');
INSERT INTO "Map" VALUES(43,'Camp Randall Stadium','http://maps.wisc.edu//?initObj=0022');
INSERT INTO "Map" VALUES(44,'Carillon Tower','http://maps.wisc.edu//?initObj=0487');
INSERT INTO "Map" VALUES(45,'Carl Schuman Shelter','http://maps.wisc.edu//?initObj=0116');
INSERT INTO "Map" VALUES(46,'Carson Gulley Center','http://maps.wisc.edu//?initObj=0565');
INSERT INTO "Map" VALUES(47,'Cereal Crops Research Unit','http://maps.wisc.edu//?initObj=0121');
INSERT INTO "Map" VALUES(48,'Chadbourne Residence Hall','http://maps.wisc.edu//?initObj=0557');
INSERT INTO "Map" VALUES(49,'Chamberlin Hall','http://maps.wisc.edu//?initObj=0055');
INSERT INTO "Map" VALUES(50,'Chamberlin House (Kronshage)','http://maps.wisc.edu//?initObj=0571');
INSERT INTO "Map" VALUES(51,'Charter Street Heating and Cooling Plant','http://maps.wisc.edu//?initObj=0529');
INSERT INTO "Map" VALUES(52,'Chazen Museum of Art','http://maps.wisc.edu//?initObj=0524');
INSERT INTO "Map" VALUES(53,'Chemistry Building','http://maps.wisc.edu//?initObj=0047');
INSERT INTO "Map" VALUES(54,'Cole Residence Hall','http://maps.wisc.edu//?initObj=0555');
INSERT INTO "Map" VALUES(55,'Computer Sciences and Statistics','http://maps.wisc.edu//?initObj=0155');
INSERT INTO "Map" VALUES(56,'Conover House (Kronshage)','http://maps.wisc.edu//?initObj=0574C');
INSERT INTO "Map" VALUES(57,'Conrad A. Elvehjem Building','http://maps.wisc.edu//?initObj=0544');
INSERT INTO "Map" VALUES(58,'Dairy Barn','http://maps.wisc.edu//?initObj=0105');
INSERT INTO "Map" VALUES(59,'Dairy Cattle Center','http://maps.wisc.edu//?initObj=0092');
INSERT INTO "Map" VALUES(60,'Davis Residence Hall','http://maps.wisc.edu//?initObj=0578');
INSERT INTO "Map" VALUES(61,'D.C. Smith Greenhouse','http://maps.wisc.edu//?initObj=0206');
INSERT INTO "Map" VALUES(62,'Dejope Residence Hall','http://maps.wisc.edu//?initObj=0567');
INSERT INTO "Map" VALUES(63,'DeLuca Biochemical Sciences Building','http://maps.wisc.edu//?initObj=0204');
INSERT INTO "Map" VALUES(64,'DeLuca Biochemistry Building','http://maps.wisc.edu//?initObj=0084');
INSERT INTO "Map" VALUES(65,'DeLuca Biochemistry Laboratories','http://maps.wisc.edu//?initObj=0205');
INSERT INTO "Map" VALUES(66,'Discovery Building','http://maps.wisc.edu//?initObj=0212');
INSERT INTO "Map" VALUES(67,'Eagle Heights','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(68,'Eagle Heights Buildings 101-108','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(69,'Eagle Heights Buildings 201-209','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(70,'Eagle Heights Buildings 301-309','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(71,'Eagle Heights Buildings 401-408','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(72,'Eagle Heights Buildings 501-509','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(73,'Eagle Heights Buildings 601-610','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(74,'Eagle Heights Buildings 701-819','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(75,'Eagle Heights Buildings 901-946','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(76,'Eagle Heights Community Center','http://maps.wisc.edu//?initObj=1299');
INSERT INTO "Map" VALUES(77,'Educational Sciences','http://maps.wisc.edu//?initObj=0154');
INSERT INTO "Map" VALUES(78,'Education Building','http://maps.wisc.edu//?initObj=0400');
INSERT INTO "Map" VALUES(79,'Engineering Centers Building','http://maps.wisc.edu//?initObj=0481');
INSERT INTO "Map" VALUES(80,'Engineering Hall','http://maps.wisc.edu//?initObj=0408');
INSERT INTO "Map" VALUES(81,'Engineering Research Building','http://maps.wisc.edu//?initObj=0762');
INSERT INTO "Map" VALUES(82,'Environmental Health and Safety Building','http://maps.wisc.edu//?initObj=0549');
INSERT INTO "Map" VALUES(83,'Enzyme Institute','http://maps.wisc.edu//?initObj=0479');
INSERT INTO "Map" VALUES(84,'Extension Building','http://maps.wisc.edu//?initObj=0500');
INSERT INTO "Map" VALUES(85,'Field House','http://maps.wisc.edu//?initObj=0029');
INSERT INTO "Map" VALUES(86,'Fleet and Service Garage','http://maps.wisc.edu//?initObj=1077');
INSERT INTO "Map" VALUES(87,'Fluno Center For Executive Education','http://maps.wisc.edu//?initObj=0139');
INSERT INTO "Map" VALUES(88,'Forest Products Laboratory','http://maps.wisc.edu//?initObj=0036');
INSERT INTO "Map" VALUES(89,'Genetics-Biotechnology Center Building','http://maps.wisc.edu//?initObj=0082');
INSERT INTO "Map" VALUES(90,'Gilman House (Kronshage)','http://maps.wisc.edu//?initObj=0569');
INSERT INTO "Map" VALUES(91,'Goodman Softball Complex','http://maps.wisc.edu//?initObj=0175');
INSERT INTO "Map" VALUES(92,'Goodnight Hall','http://maps.wisc.edu//?initObj=0508');
INSERT INTO "Map" VALUES(93,'Gordon Dining and Event Center','http://maps.wisc.edu//?initObj=1249');
INSERT INTO "Map" VALUES(94,'Grainger Hall','http://maps.wisc.edu//?initObj=0140');
INSERT INTO "Map" VALUES(95,'Gymnasium-Natatorium','http://maps.wisc.edu//?initObj=0031');
INSERT INTO "Map" VALUES(96,'Hanson Biomedical Sciences Building','http://maps.wisc.edu//?initObj=0094');
INSERT INTO "Map" VALUES(97,'Harlow Primate Lab','http://maps.wisc.edu//?initObj=0527');
INSERT INTO "Map" VALUES(98,'Harvey Street Apartments','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(99,'Hasler Laboratory of Limnology','http://maps.wisc.edu//?initObj=0483');
INSERT INTO "Map" VALUES(100,'Health Sciences Learning Center','http://maps.wisc.edu//?initObj=1480');
INSERT INTO "Map" VALUES(101,'Helen C. White Hall','http://maps.wisc.edu//?initObj=0018');
INSERT INTO "Map" VALUES(102,'Hiram Smith Annex','http://maps.wisc.edu//?initObj=0077');
INSERT INTO "Map" VALUES(103,'Hiram Smith Hall','http://maps.wisc.edu//?initObj=0076');
INSERT INTO "Map" VALUES(104,'Holt Center (Kronshage)','http://maps.wisc.edu//?initObj=0574H');
INSERT INTO "Map" VALUES(105,'Horse Barn','http://maps.wisc.edu//?initObj=0095');
INSERT INTO "Map" VALUES(106,'Horticulture','http://maps.wisc.edu//?initObj=0087B');
INSERT INTO "Map" VALUES(107,'Humphrey Hall','http://maps.wisc.edu//?initObj=0136');
INSERT INTO "Map" VALUES(108,'Ingraham Hall','http://maps.wisc.edu//?initObj=0056');
INSERT INTO "Map" VALUES(109,'Jones House (Kronshage)','http://maps.wisc.edu//?initObj=0572');
INSERT INTO "Map" VALUES(110,'Jorns Hall','http://maps.wisc.edu//?initObj=0137');
INSERT INTO "Map" VALUES(111,'Kellner Hall','http://maps.wisc.edu//?initObj=0460');
INSERT INTO "Map" VALUES(112,'King Hall','http://maps.wisc.edu//?initObj=0074A');
INSERT INTO "Map" VALUES(113,'Kronshage Residence Hall','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(114,'LaBahn Arena','http://maps.wisc.edu//?initObj=0227');
INSERT INTO "Map" VALUES(115,'Lathrop Hall','http://maps.wisc.edu//?initObj=0032');
INSERT INTO "Map" VALUES(116,'Law Building','http://maps.wisc.edu//?initObj=0430');
INSERT INTO "Map" VALUES(117,'Leopold Residence Hall','http://maps.wisc.edu//?initObj=0576');
INSERT INTO "Map" VALUES(118,'Livestock Laboratory','http://maps.wisc.edu//?initObj=0115');
INSERT INTO "Map" VALUES(119,'Lowell Center','http://maps.wisc.edu//?initObj=0502');
INSERT INTO "Map" VALUES(120,'Mack House (Kronshage)','http://maps.wisc.edu//?initObj=0570');
INSERT INTO "Map" VALUES(121,'Materials Science and Engineering Building','http://maps.wisc.edu//?initObj=0520');
INSERT INTO "Map" VALUES(122,'McArdle Cancer Research Building','http://maps.wisc.edu//?initObj=0468');
INSERT INTO "Map" VALUES(123,'McClain Athletic Facility','http://maps.wisc.edu//?initObj=0021');
INSERT INTO "Map" VALUES(124,'Meat Science and Muscle Biology Lab','http://maps.wisc.edu//?initObj=0123');
INSERT INTO "Map" VALUES(125,'Mechanical Engineering Building','http://maps.wisc.edu//?initObj=0407');
INSERT INTO "Map" VALUES(126,'Medical Sciences','http://maps.wisc.edu//?initObj=0451C');
INSERT INTO "Map" VALUES(127,'Medical Sciences Center','http://maps.wisc.edu//?initObj=0450');
INSERT INTO "Map" VALUES(128,'Meiklejohn House','http://maps.wisc.edu//?initObj=0035');
INSERT INTO "Map" VALUES(129,'Memorial Library','http://maps.wisc.edu//?initObj=0015');
INSERT INTO "Map" VALUES(130,'Memorial Union','http://maps.wisc.edu//?initObj=0008');
INSERT INTO "Map" VALUES(131,'Merit Residence Hall','http://maps.wisc.edu//?initObj=0575');
INSERT INTO "Map" VALUES(132,'Microbial Sciences','http://maps.wisc.edu//?initObj=0060');
INSERT INTO "Map" VALUES(133,'Middleton Building','http://maps.wisc.edu//?initObj=0455');
INSERT INTO "Map" VALUES(134,'Moore Hall - Agronomy','http://maps.wisc.edu//?initObj=0087A');
INSERT INTO "Map" VALUES(135,'Mosse Humanities Building','http://maps.wisc.edu//?initObj=0469');
INSERT INTO "Map" VALUES(136,'Music Hall','http://maps.wisc.edu//?initObj=0485');
INSERT INTO "Map" VALUES(137,'Nancy Nicholas Hall','http://maps.wisc.edu//?initObj=0085');
INSERT INTO "Map" VALUES(138,'Nicholas-Johnson Pavilion and Plaza','http://maps.wisc.edu//?initObj=0226');
INSERT INTO "Map" VALUES(139,'Nielsen Tennis Stadium','http://maps.wisc.edu//?initObj=0038');
INSERT INTO "Map" VALUES(140,'Noland Zoology Building','http://maps.wisc.edu//?initObj=0402');
INSERT INTO "Map" VALUES(141,'North Hall','http://maps.wisc.edu//?initObj=0052');
INSERT INTO "Map" VALUES(142,'Nutritional Sciences','http://maps.wisc.edu//?initObj=0449');
INSERT INTO "Map" VALUES(143,'Observatory Hill Office Building','http://maps.wisc.edu//?initObj=0512');
INSERT INTO "Map" VALUES(144,'Ogg Residence Hall','http://maps.wisc.edu//?initObj=1243');
INSERT INTO "Map" VALUES(145,'Phillips Residence Hall','http://maps.wisc.edu//?initObj=0507');
INSERT INTO "Map" VALUES(146,'Plant Sciences','http://maps.wisc.edu//?initObj=0087C');
INSERT INTO "Map" VALUES(147,'Police and Security Facility','http://maps.wisc.edu//?initObj=0550');
INSERT INTO "Map" VALUES(148,'Porter Boathouse','http://maps.wisc.edu//?initObj=0172');
INSERT INTO "Map" VALUES(149,'Poultry Research Laboratory','http://maps.wisc.edu//?initObj=0110');
INSERT INTO "Map" VALUES(150,'Pyle Center','http://maps.wisc.edu//?initObj=0006');
INSERT INTO "Map" VALUES(151,'Radio Hall','http://maps.wisc.edu//?initObj=0405');
INSERT INTO "Map" VALUES(152,'Rennebohm Hall','http://maps.wisc.edu//?initObj=0034');
INSERT INTO "Map" VALUES(153,'Russell Laboratories','http://maps.wisc.edu//?initObj=0114');
INSERT INTO "Map" VALUES(154,'Rust-Schreiner Hall','http://maps.wisc.edu//?initObj=0158');
INSERT INTO "Map" VALUES(155,'School of Social Work Building','http://maps.wisc.edu//?initObj=0453');
INSERT INTO "Map" VALUES(156,'Science Hall','http://maps.wisc.edu//?initObj=0053');
INSERT INTO "Map" VALUES(157,'Seed Building','http://maps.wisc.edu//?initObj=0119');
INSERT INTO "Map" VALUES(158,'Sellery Residence Hall','http://maps.wisc.edu//?initObj=1245');
INSERT INTO "Map" VALUES(159,'Service Building','http://maps.wisc.edu//?initObj=0530');
INSERT INTO "Map" VALUES(160,'Service Building Annex','http://maps.wisc.edu//?initObj=0534');
INSERT INTO "Map" VALUES(161,'Service Memorial Institute','http://maps.wisc.edu//?initObj=0451A');
INSERT INTO "Map" VALUES(162,'Sewell Social Sciences','http://maps.wisc.edu//?initObj=0046');
INSERT INTO "Map" VALUES(163,'Showerman House (Kronshage)','http://maps.wisc.edu//?initObj=0574S');
INSERT INTO "Map" VALUES(164,'Signe Skott Cooper Hall','http://maps.wisc.edu//?initObj=0044');
INSERT INTO "Map" VALUES(165,'Slichter Residence Hall','http://maps.wisc.edu//?initObj=0558');
INSERT INTO "Map" VALUES(166,'Smith Residence Hall','http://maps.wisc.edu//?initObj=1079');
INSERT INTO "Map" VALUES(167,'Soils Building','http://maps.wisc.edu//?initObj=0074B');
INSERT INTO "Map" VALUES(168,'Southeast Recreational Facility (SERF)','http://maps.wisc.edu//?initObj=0028');
INSERT INTO "Map" VALUES(169,'Southeast Residence Halls','http://maps.wisc.edu//');
INSERT INTO "Map" VALUES(170,'South Hall','http://maps.wisc.edu//?initObj=0051');
INSERT INTO "Map" VALUES(171,'State Historical Society','http://maps.wisc.edu//?initObj=0016');
INSERT INTO "Map" VALUES(172,'Steenbock Library','http://maps.wisc.edu//?initObj=0079');
INSERT INTO "Map" VALUES(173,'Sterling Hall','http://maps.wisc.edu//?initObj=0057');
INSERT INTO "Map" VALUES(174,'Stock Pavilion','http://maps.wisc.edu//?initObj=0090');
INSERT INTO "Map" VALUES(175,'Stovall Building (Wisconsin State Laboratory of Hygiene)','http://maps.wisc.edu//?initObj=0476');
INSERT INTO "Map" VALUES(176,'Sullivan Residence Hall','http://maps.wisc.edu//?initObj=0556');
INSERT INTO "Map" VALUES(177,'Swenson House (Kronshage)','http://maps.wisc.edu//?initObj=0573');
INSERT INTO "Map" VALUES(178,'Taylor Hall','http://maps.wisc.edu//?initObj=0464');
INSERT INTO "Map" VALUES(179,'Teacher Education','http://maps.wisc.edu//?initObj=0153');
INSERT INTO "Map" VALUES(180,'The Kohl Center','http://maps.wisc.edu//?initObj=0225');
INSERT INTO "Map" VALUES(181,'Tripp Residence Hall','http://maps.wisc.edu//?initObj=0563');
INSERT INTO "Map" VALUES(182,'Turner House (Kronshage)','http://maps.wisc.edu//?initObj=0568');
INSERT INTO "Map" VALUES(183,'Union South','http://maps.wisc.edu//?initObj=0088');
INSERT INTO "Map" VALUES(184,'University Apartments Facilities Office','http://maps.wisc.edu//?initObj=1200');
INSERT INTO "Map" VALUES(185,'University Club','http://maps.wisc.edu//?initObj=0515B');
INSERT INTO "Map" VALUES(186,'University Houses','http://maps.wisc.edu//?initObj=1201');
INSERT INTO "Map" VALUES(187,'U.S. Dairy Forage Research Center','http://maps.wisc.edu//?initObj=0096');
INSERT INTO "Map" VALUES(188,'UW Foundation','http://maps.wisc.edu//?initObj=0493');
INSERT INTO "Map" VALUES(189,'UW Hospital and Clinics (Clinical Science Center)','http://maps.wisc.edu//?initObj=1400');
INSERT INTO "Map" VALUES(190,'UW Medical Foundation Centennial Building','http://maps.wisc.edu//?initObj=1435');
INSERT INTO "Map" VALUES(191,'Van Hise Hall','http://maps.wisc.edu//?initObj=0482');
INSERT INTO "Map" VALUES(192,'Van Vleck Hall','http://maps.wisc.edu//?initObj=0048');
INSERT INTO "Map" VALUES(193,'Veterans Administration Hospital','http://maps.wisc.edu//?initObj=1055');
INSERT INTO "Map" VALUES(194,'Veterinary Medicine','http://maps.wisc.edu//?initObj=0093');
INSERT INTO "Map" VALUES(195,'Vilas Hall','http://maps.wisc.edu//?initObj=0545');
INSERT INTO "Map" VALUES(196,'Waisman Center','http://maps.wisc.edu//?initObj=0459');
INSERT INTO "Map" VALUES(197,'Walnut Street Greenhouse','http://maps.wisc.edu//?initObj=0122');
INSERT INTO "Map" VALUES(198,'WARF Office Building','http://maps.wisc.edu//?initObj=0039');
INSERT INTO "Map" VALUES(199,'Washburn Observatory','http://maps.wisc.edu//?initObj=0510');
INSERT INTO "Map" VALUES(200,'Water Science and Engineering Laboratory','http://maps.wisc.edu//?initObj=0403');
INSERT INTO "Map" VALUES(201,'Waters Residence Hall','http://maps.wisc.edu//?initObj=0559');
INSERT INTO "Map" VALUES(202,'Weeks Hall for Geological Sciences','http://maps.wisc.edu//?initObj=0521');
INSERT INTO "Map" VALUES(203,'Wendt Commons','http://maps.wisc.edu//?initObj=0404');
INSERT INTO "Map" VALUES(204,'West Campus Cogeneration Facility','http://maps.wisc.edu//?initObj=0120');
INSERT INTO "Map" VALUES(205,'Wisconsin Energy Institute','http://maps.wisc.edu//?initObj=0752');
INSERT INTO "Map" VALUES(206,'Wisconsin Institutes for Medical Research','http://maps.wisc.edu//?initObj=1485');
INSERT INTO "Map" VALUES(207,'Wisconsin Primate Center','http://maps.wisc.edu//?initObj=0526');
INSERT INTO "Map" VALUES(208,'Wisconsin Veterinary Diagnostic Laboratory','http://maps.wisc.edu//?initObj=0126');
INSERT INTO "Map" VALUES(209,'Witte Residence Hall','http://maps.wisc.edu//?initObj=1246');
INSERT INTO "Map" VALUES(210,'Zoe Bayliss Co-Op','http://maps.wisc.edu//?initObj=0577');
INSERT INTO "Map" VALUES(211,'Zoology Research Building','http://maps.wisc.edu//?initObj=0401');
CREATE TABLE Professor(
            profID INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT);
CREATE TABLE Section(
            sectionID INTEGER PRIMARY KEY AUTOINCREMENT,
            section INTEGER,
            courseID INTEGER,
            profID INTEGER,
            gradesID INTEGER,
            termID INTEGER,
            FOREIGN KEY(courseID) REFERENCES Course(courseID),
            FOREIGN KEY(profID) REFERENCES Professor(profID),
            FOREIGN KEY(gradesID) REFERENCES Grades(gradesID),
            FOREIGN KEY(termID) REFERENCES Term(termID));
CREATE TABLE Term(
            termID INTEGER PRIMARY KEY,
            name TEXT);
DELETE FROM "sqlite_sequence";
COMMIT;