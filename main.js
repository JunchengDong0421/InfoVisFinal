console.log('Authors: Juncheng, Mostafa')

const WIDTH = 1000;
const HEIGHT = 600;
const MARGIN = {top: 20, right: 40, bottom: 50, left: 40};

function useData(csvPath) {
    const [dataAll, setData] = React.useState(null);
    React.useEffect(() => {
        d3.csv(csvPath).then(data => {
            if ("Gold" in data[0]) { // process medal data
                data.forEach(d => {
                    d.NOC = d['Team/NOC'];
                    d.Gold = +d.Gold;
                    d.Silver = +d.Silver;
                    d.Bronze = +d.Bronze;
                    d.Total = +d.Total;
                    d.Rank = +d.Rank;
                    d['Rank by Total'] = +d['Rank by Total'];
                })
            }
            setData(data);
        });
    }, []);
    return dataAll;
}

function getOverviewTree(data) {
    // overview treemap json data
    if ("Gold" in data[0]) {  // medal tree
        return data.map(d => {
            return {name: d.NOC, value: d.Total};
        });
    } else {  // athlete tree
        const groupedData = d3.groups(data, d => d.NOC);
        return groupedData.map(d => {
            return {name: d[0], value: d[1].length};
        }).sort((a, b) => b.value - a.value);
    }
}

function getDetailTree(data) {
    // detail treemap json data
    if (data.length === 0) {  // medal tree with no record
        return null;
    }
    const singleData = data[0];
    if ("Gold" in data[0]) { // medal tree (with record)
        return [{name: 'Gold', value: singleData.Gold},
            {name: 'Silver', value: singleData.Silver},
            {name: 'Bronze', value: singleData.Bronze}];
    } else {  // athlete tree
        const groupedData = d3.groups(data, d => d.Discipline);
        return groupedData.map(d => {
            return {name: d[0], value: d[1].length};
        }).sort((a, b) => b.value - a.value);
    }
}

function TreeMapText(props) {
    const {d} = props;
    const textStyle = {
        fontSize: "10px",
        whiteSpace: 'pre-wrap',  // enable line escape
        lineHeight: '120%'  // shrink line height (for better display)
    };
    return <foreignObject width={d.x1-d.x0} height={d.y1-d.y0}>
        <div >
            <p style={textStyle}>
                {d.ancestors().reverse().slice(1).map((d, idx) => d.data.name)
                .join("\n")+"\nCount: "+d.value}
            </p>
        </div>
        </foreignObject>;
}

function OverviewTreeMap(props) {
    const {tree, selectedCountry, setSelectedCountry} = props;
    const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const root = d3.treemap().tile(d3.treemapBinary).size([innerWidth, innerHeight]).padding(2)
            .round(true)(d3.hierarchy(tree).sum(d => d.children ? 0 : d.value))
            .sort((a, b) => b.value - a.value);
    const leaves = root.leaves();
    const color = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(leaves, d => d.value)]);
    const sameCell = NOC => selectedCountry === NOC;
    return <svg width={WIDTH} height={HEIGHT}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            {leaves.map((d, idx) => {
                const nameOfCountry = d.data.name;
                return <g key={idx+"treemap"} transform={`translate(${d.x0}, ${d.y0})`}
                    onMouseOver={()=>{setSelectedCountry(nameOfCountry)}} onMouseOut={()=>{setSelectedCountry(null)}}>
                    <rect width={d.x1-d.x0} height={d.y1-d.y0} stroke={sameCell(nameOfCountry) ? 'black': 'none'}
                          strokeWidth={sameCell(nameOfCountry) ? '4px': '0'}
                          fill={color(d.data.value)} opacity={0.8}/>
                    <TreeMapText d={d}/>
                </g>
            })}
        </g>
    </svg>;
}

function DetailTreeMap(props) {
    const {tree} = props;
    const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    if (!tree.children) {
        return <svg width={WIDTH} height={HEIGHT}>
            <text fontSize={'3em'} x={innerWidth/2-MARGIN.left-MARGIN.right}
                  y={innerHeight/2+MARGIN.top+MARGIN.bottom}>No Record</text>
        </svg>
    }
    const root = d3.treemap().tile(d3.treemapBinary).size([innerWidth, innerHeight]).padding(2)
            .round(true)(d3.hierarchy(tree).sum(d => d.children ? 0 : d.value));
    const leaves = root.leaves();
    const leavesCategories = leaves.filter(d => d.data.name);  // d.data.name is the type of medal/discipline
    const athleteColor = d3.scaleOrdinal(d3.schemePaired).domain(leavesCategories);
    const colorList = tree.type === 'athlete' ? leaves.map(d => athleteColor(d.data.name)) :
        ['gold', 'silver', '#CD7F32'];
    const color = idx => colorList[idx];
    return <svg width={WIDTH} height={HEIGHT}>
        <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
            {leaves.map((d, idx) => {
                return <g key={idx+"treemap"} transform={`translate(${d.x0}, ${d.y0})`}>
                    <rect width={d.x1-d.x0} height={d.y1-d.y0} stroke={'none'}
                          fill={color(idx)} opacity={0.8}/>
                    <TreeMapText d={d}/>
                </g>
            })}
        </g>
    </svg>;
}

function TreeMapTitle(props) {  // mainly for styling
    const {text} = props;
    const titleStyle = {
        width: WIDTH,
        transform: `translate(${MARGIN.left}, 0)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '1.2em'
    };
    return <div style={titleStyle}>
        {text}
    </div>;
}

function DisplaySlider(props) {
    const {maxValue, maxDisplay, setMaxDisplay} = props;
    return <div>
        Top <input type="text" style={{'width': '25px'}} value={maxDisplay} readOnly/>
        <input type='range' min='1' max={maxValue} value={maxDisplay} step='1'
               onChange={(e)=>setMaxDisplay(e.target.value)}/>
    </div>;
}

function CountryDropdown (props) {
    const {options, selectedValue, onSelectedValueChange} = props;
    return <select defaultValue={selectedValue}
                   onChange={event => onSelectedValueChange(event.target.value)}>
        {options.map( d => {
            return <option key={d} value={d} >
                {d}
            </option>
        })}
    </select>
}

function ViewSwitch(props) {
    const {viewCountry, changeView} = props;
    const layerStyle = {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
        margin: '20px'
    };
    const buttonStyle = disabled => {
        return {
            fontFamily: 'Georgia,sans-serif',
            fontSize: '1.2em',
            width: '160px',
            height: '40px',
            borderRadius: '10px',
            cursor: disabled ? 'no-drop' : 'pointer'
        };
    };
    return <div style={layerStyle}>
        <button style={buttonStyle(!!!viewCountry)} disabled={!!!viewCountry} onClick={() => changeView(null)}>Overview</button>
        <button style={buttonStyle(!!viewCountry)} disabled={!!viewCountry} onClick={() => changeView('People\'s Republic of China')}>Detail View</button>
    </div>
}

const TokyoOlympics = () => {
    const [selectedCountry, setSelectedCountry] = React.useState(null);  // selected country in maps
    const [detailCountry, setDetailCountry] = React.useState(null);  // default: overview
    const [mMaxDisplay, setMMaxDisplay] = React.useState(30);  // default: Top30
    const [aMaxDisplay, setAMaxDisplay] = React.useState(50);  // default: Top50
    const mData = useData('data/Medals.csv');
    const aData = useData('data/Athletes.csv');
    if (!mData || !aData) {
        return <pre>loading...</pre>;
    }
    const countryList = Array.from(new Set(aData.map(d => d.NOC))).sort((a, b) => a.localeCompare(b));
    let mTreeJson = !detailCountry ? getOverviewTree(mData).slice(0, mMaxDisplay) :
        getDetailTree(mData.filter(d => d.NOC === detailCountry));
    let aTreeJson = !detailCountry ? getOverviewTree(aData).slice(0, aMaxDisplay) :
        getDetailTree(aData.filter(d => d.NOC === detailCountry));
    let mTree = {name: 'root', children: mTreeJson, type: 'medal'};
    let aTree = {name: 'root', children: aTreeJson, type: 'athlete'};
    if (!detailCountry) {
        return <div>
            <ViewSwitch viewCountry={detailCountry} changeView={setDetailCountry}/>
            <TreeMapTitle text={'Number of Medals by Country'} />
            <DisplaySlider maxValue={mData.length} maxDisplay={mMaxDisplay} setMaxDisplay={setMMaxDisplay} />
            <OverviewTreeMap tree={mTree} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}/>
            <TreeMapTitle text={'Number of Athletes by Country'} />
            <DisplaySlider maxValue={countryList.length} maxDisplay={aMaxDisplay} setMaxDisplay={setAMaxDisplay} />
            <OverviewTreeMap tree={aTree} selectedCountry={selectedCountry} setSelectedCountry={setSelectedCountry}/>
        </div>;
    } else {
        return <div>
            <ViewSwitch viewCountry={detailCountry} changeView={setDetailCountry}/>
            <CountryDropdown options={countryList} selectedValue={detailCountry}
                             onSelectedValueChange={setDetailCountry} />
            <TreeMapTitle text={`Total Medals: ${!mTreeJson ? 0 : d3.sum(mTreeJson, d => d.value)}`} />
            <DetailTreeMap tree={mTree} />
            <TreeMapTitle text={`Total Athletes: ${d3.sum(aTreeJson, d => d.value)}`} />
            <DetailTreeMap tree={aTree} />
        </div>;
    }
}

ReactDOM.render( <TokyoOlympics />, document.getElementById('root'));