const WIDTH = 1200;
const HEIGHT = 600;
const margin = {
  top: 20,
  right: 40,
  bottom: 20,
  left: 40,
};
const csvMedalUrl = "/Medals.csv";
const csvAthletesUrl = "/Athletes.csv";
const mapUrl = "https://unpkg.com/world-atlas@2.0.2/countries-110m.json";

function useMap(jsonPath) {
  const [data, setData] = React.useState(null);
  React.useEffect(() => {
    d3.json(jsonPath).then((topoJsonData) => {
      setData(topojson.feature(topoJsonData, topoJsonData.objects.countries));
    });
  }, []);
  // console.log("data", data);
  return data;
}

function useMedals(csvPath) {
  const [dataAll, setData] = React.useState(null);
  React.useEffect(() => {
    d3.csv(csvPath).then((data) => {
      data.forEach((d) => {
        d.NOC = d["Team/NOC"];
        d.Gold = +d.Gold;
        d.Silver = +d.Silver;
        d.Bronze = +d.Bronze;
        d.Total = +d.Total;
      });
      setData(data);
    });
  }, []);
  return dataAll;
}

function TheMap(props) {
  const { map, data, color, medal, selectedTeam, setSelectedTeam } = props;
  // console.log(map);
  const projection = d3.geoEqualEarth();
  const path = d3.geoPath(projection);
  return (
    <g>
      <path
        className={"sphere"}
        d={path({
          type: "Sphere",
        })}
        fill="lightblue"
      />
      {map.features.map((feature) => {
        const country = data.filter((d) => d.NOC === feature.properties.name);
        if (country[0] && medal == "Total") {
          return (
            <path
              key={feature.properties.name + "boundary"}
              className={"boundary"}
              d={path(feature)}
              style={{
                fill: color(country[0].Total),
              }}
              onMouseEnter={(event) => {
                setSelectedTeam(country[0].NOC);
                console.log(country[0].NOC);
                console.log(country[0].Total);
              }}
              onMouseOut={() => {
                setSelectedTeam(null);
              }}
            />
          );
        } else if (country[0] && medal == "Gold") {
          return (
            <path
              key={feature.properties.name + "boundary"}
              className={"boundary"}
              d={path(feature)}
              style={{
                fill: color(country[0].Gold),
              }}
              onMouseEnter={(event) => {
                setSelectedTeam(country[0].NOC);
                console.log(country[0].NOC);
                console.log(country[0].Gold);
              }}
              onMouseOut={() => {
                setSelectedTeam(null);
              }}
            />
          );
        } else if (country[0] && medal == "Silver") {
          return (
            <path
              key={feature.properties.name + "boundary"}
              className={"boundary"}
              d={path(feature)}
              style={{
                fill: color(country[0].Silver),
              }}
              onMouseEnter={(event) => {
                setSelectedTeam(country[0].NOC);
                console.log(country[0].NOC);
                console.log(country[0].Silver);
              }}
              onMouseOut={() => {
                setSelectedTeam(null);
              }}
            />
          );
        } else if (country[0] && medal == "Bronze") {
          return (
            <path
              key={feature.properties.name + "boundary"}
              className={"boundary"}
              d={path(feature)}
              style={{
                fill: color(country[0].Bronze),
              }}
              onMouseEnter={(event) => {
                setSelectedTeam(country[0].NOC);
                console.log(country[0].NOC);
                console.log(country[0].Bronze);
              }}
              onMouseOut={() => {
                setSelectedTeam(null);
              }}
            />
          );
        } else {
          return (
            <path
              key={feature.properties.name + "boundary"}
              className={"boundary"}
              d={path(feature)}
              fill="grey"
            />
          );
        }
      })}{" "}
    </g>
  );
}

function WorldMap(props) {
  const [selectedTeam, setSelectedTeam] = React.useState(null);
  const rawData = useMedals(csvMedalUrl);
  const map = useMap(mapUrl);
  const [medal, setMedal] = React.useState(0);
  if (!map || !rawData) {
    return <pre> Loading... </pre>;
  }
  const maxTotal = d3.max(rawData, (d) => d.Total);
  const maxGold = d3.max(rawData, (d) => d.Gold);
  const maxSilver = d3.max(rawData, (d) => d.Silver);
  const maxBronze = d3.max(rawData, (d) => d.Bronze);

  const MAPFILTER = ["Total", "Gold", "Silver", "Bronze"];
  const changeHandler = (event) => {
    // console.log(event);
    setMedal(event.target.value);
  };

  var colorScale;
  if (MAPFILTER[medal] === "Total") {
    colorScale = d3.scaleLinear().domain([0, maxTotal]).range(["beige", "red"]);
  }
  if (MAPFILTER[medal] === "Gold") {
    colorScale = d3.scaleLinear().domain([0, maxGold]).range(["beige", "red"]);
  }
  if (MAPFILTER[medal] === "Silver") {
    colorScale = d3
      .scaleLinear()
      .domain([0, maxSilver])
      .range(["beige", "red"]);
  }
  if (MAPFILTER[medal] === "Bronze") {
    colorScale = d3
      .scaleLinear()
      .domain([0, maxBronze])
      .range(["beige", "red"]);
  }
  return (
    <div>
      <input
        key="slider"
        type="range"
        min="0"
        max="3"
        value={medal}
        step="1"
        onChange={changeHandler}
      />{" "}
      <input key="monthText" type="text" value={MAPFILTER[medal]} readOnly />
      <svg width={WIDTH} height={HEIGHT}>
        <TheMap
          map={map}
          data={rawData}
          color={colorScale}
          medal={MAPFILTER[medal]}
          selectedTeam={selectedTeam}
          setSelectedTeam={setSelectedTeam}
        />{" "}
      </svg>{" "}
    </div>
  );
}
