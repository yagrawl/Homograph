SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";

CREATE TABLE IF NOT EXISTS `demo` (
  `user_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  `number` int(100) NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=latin1 AUTO_INCREMENT=3;

CREATE TABLE IF NOT EXISTS `domains` (
    `ascii` varchar(100) NOT NULL,
    `status` int(100) NOT NULL,
    PRIMARY KEY (`ascii`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

INSERT INTO `domains` (`ascii`, `status`) VALUES
('xn--pple-4na', 0),
('xn--pple-koa', 0),
('xn--pple-poa', 0),
('xn--appl-jpa', 1),
('xn--appl-ova', 0),
('xn--appl-yva', 0),
('xn--googl-fsa', 0),
('xn--googl-lsa', 0),
('xn--googl-b0a', 0),
('xn--youtub-gva', 0),
('xn--youtub-nva', 0),
('xn--chas-epa', 0),
('xn--fcebook-xwa', 0),
('xn--fcebook-5wa', 0),
('xn--fcebook-exa', 0),
('xn--facbook-tya', 0),
('xn--faceboo-sv8c', 1),
('xn--mazon-qqa', 0),
('xn--mazon-wqa', 0),
('xn--mazon-2qa', 1),
('xn--mazon-8qa', 0),
('xn--pypal-9qa', 0),
('xn--pypal-gra', 0);
