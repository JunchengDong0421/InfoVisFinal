// all the countries in the map data
let f = [
    "Afghanistan",
    "Albania",
    "Algeria",
    "Angola",
    "Antarctica",
    "Argentina",
    "Armenia",
    "Australia",
    "Austria",
    "Azerbaijan",
    "Bahamas",
    "Bangladesh",
    "Belarus",
    "Belgium",
    "Belize",
    "Benin",
    "Bhutan",
    "Bolivia",
    "Bosnia and Herz.",
    "Botswana",
    "Brazil",
    "Brunei",
    "Bulgaria",
    "Burkina Faso",
    "Burundi",
    "Cambodia",
    "Cameroon",
    "Canada",
    "Central African Rep.",
    "Chad",
    "Chile",
    "China",
    "Colombia",
    "Congo",
    "Costa Rica",
    "Côte d'Ivoire",
    "Croatia",
    "Cuba",
    "Cyprus",
    "Czechia",
    "Dem. Rep. Congo",
    "Denmark",
    "Djibouti",
    "Dominican Rep.",
    "Ecuador",
    "Egypt",
    "El Salvador",
    "Eq. Guinea",
    "Eritrea",
    "Estonia",
    "eSwatini",
    "Ethiopia",
    "Falkland Is.",
    "Fiji",
    "Finland",
    "Fr. S. Antarctic Lands",
    "France",
    "Gabon",
    "Gambia",
    "Georgia",
    "Germany",
    "Ghana",
    "Greece",
    "Greenland",
    "Guatemala",
    "Guinea",
    "Guinea-Bissau",
    "Guyana",
    "Haiti",
    "Honduras",
    "Hungary",
    "Iceland",
    "India",
    "Indonesia",
    "Iran",
    "Iraq",
    "Ireland",
    "Israel",
    "Italy",
    "Jamaica",
    "Japan",
    "Jordan",
    "Kazakhstan",
    "Kenya",
    "Kosovo",
    "Kuwait",
    "Kyrgyzstan",
    "Laos",
    "Latvia",
    "Lebanon",
    "Lesotho",
    "Liberia",
    "Libya",
    "Lithuania",
    "Luxembourg",
    "Macedonia",
    "Madagascar",
    "Malawi",
    "Malaysia",
    "Mali",
    "Mauritania",
    "Mexico",
    "Moldova",
    "Mongolia",
    "Montenegro",
    "Morocco",
    "Mozambique",
    "Myanmar",
    "N. Cyprus",
    "Namibia",
    "Nepal",
    "Netherlands",
    "New Caledonia",
    "New Zealand",
    "Nicaragua",
    "Niger",
    "Nigeria",
    "North Korea",
    "Norway",
    "Oman",
    "Pakistan",
    "Palestine",
    "Panama",
    "Papua New Guinea",
    "Paraguay",
    "Peru",
    "Philippines",
    "Poland",
    "Portugal",
    "Puerto Rico",
    "Qatar",
    "Romania",
    "Russia",
    "Rwanda",
    "S. Sudan",
    "Saudi Arabia",
    "Senegal",
    "Serbia",
    "Sierra Leone",
    "Slovakia",
    "Slovenia",
    "Solomon Is.",
    "Somalia",
    "Somaliland",
    "South Africa",
    "South Korea",
    "Spain",
    "Sri Lanka",
    "Sudan",
    "Suriname",
    "Sweden",
    "Switzerland",
    "Syria",
    "Taiwan",
    "Tajikistan",
    "Tanzania",
    "Thailand",
    "Timor-Leste",
    "Togo",
    "Trinidad and Tobago",
    "Tunisia",
    "Turkey",
    "Turkmenistan",
    "Uganda",
    "Ukraine",
    "United Arab Emirates",
    "United Kingdom",
    "United States of America",
    "Uruguay",
    "Uzbekistan",
    "Vanuatu",
    "Venezuela",
    "Vietnam",
    "W. Sahara",
    "Yemen",
    "Zambia",
    "Zimbabwe"
]

// Names in Athletes.csv but not in map, either because of alias or that the map does not cover that country/region
let c = [
    "Bahrain",
    "Bermuda",
    "Chinese Taipei",  // Taiwan
    "Czech Republic",  // Czechia
    "Dominican Republic",  // Dominican Rep.
    "Great Britain",  // United Kingdom
    "Grenada",
    "Hong Kong, China",
    "Islamic Republic of Iran",  // Iran
    "North Macedonia",  // Macedonia
    "People's Republic of China",  // China
    "Republic of Korea",  // South Korea
    "Republic of Moldova",  // Moldova
    "ROC",  // Russia
    "San Marino",
    "Syrian Arab Republic"  // Syria
]

console.log(f.length)  // 177