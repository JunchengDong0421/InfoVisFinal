# InfoVisFinal

## Code Explanations
***
-&nbsp;When `selectedCountry` and `detailCountry` both are NOT `null`, the user is hovering on the world map;  
When `selectedCountry` is NOT `null` but `detailCountry` is `null`, the user is on the "Overview" page (and is not 
hovering on the world map);  
When `detailCountry` is NOT `null` but `selectedCountry` is `null`, the user is on the "Detail" page (and is not 
hovering on the world map).  
-&nbsp;Color scales for both World Map View and Overview Tree Map View are uniform, because non-uniform ones does not 
work well when number of countries is small.

## Archived
***
- `map.js`: old code of world map.
- `names.js`: shows country name discrepancies in map data and Olympics data