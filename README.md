# InfoVisFinal

## Summary
A brief visualization of medal and athlete datasets of all countries participating in the 2020 Tokyo Olympics.

## Code Explanations
1. When `selectedCountry` and `detailCountry` both are NOT `null`, the user is hovering on the world map;  
When `selectedCountry` is NOT `null` but `detailCountry` is `null`, the user is on the "Overview" page (and is not 
hovering on the world map);  
When `detailCountry` is NOT `null` but `selectedCountry` is `null`, the user is on the "Detail" page (and is not 
hovering on the world map).  
2. Color scales for both World Map View and Overview Tree Map View are uniform, because non-uniform ones does not 
work well when number of countries is small.

## Archived
- `map.js`: old code of world map.
- `names.js`: shows country name discrepancies in map data and Olympics data.

## Author Contacts
Juncheng Dong: [jd4115@nyu.edu](mailto:jd4115@nyu.edu)  
Mostafa Helaly: [meh626@nyu.edu](mailto:meh626@nyu.edu)