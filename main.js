console.log('Authors: Juncheng Dong (jd4115@nyu.edu), Mostafa Helaly (meh626@nyu.edu)' + '\n\n' +
    'See more details on https://github.com/JunchengDong0421/InfoVisFinal')

const WIDTH = 1000;
const HEIGHT = 600;
const MARGIN = {top: 20, right: 40, bottom: 40, left: 40};

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
    let tree = [];
    if (data.length === 0) {  // medal tree with no record
        return tree;
    }
    const singleData = data[0];
    if ("Gold" in data[0]) { // medal tree (with record)
        ['Gold', 'Silver', 'Bronze'].map(d => {
            const val = singleData[d];
            if (val !== 0) {tree.push({name: d, value: val})}
        })
        return tree;
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
                .join("\n")+"\n"+d.value}
            </p>
        </div>
        </foreignObject>;
}

function OverviewTreeMap(props) {
    const {tree, color, selectedCountry, mouseOver, mouseOut} = props;
    const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const legendWidth = 400; // make sure do not overflow x-axis of screen
    const legendHeight = 60; // DO NOT change, otherwise not legend may not align in center
    const root = d3.treemap().tile(d3.treemapBinary).size([innerWidth, innerHeight]).padding(2)
            .round(true)(d3.hierarchy(tree).sum(d => d.children ? 0 : d.value))
            .sort((a, b) => b.value - a.value);
    const leaves = root.leaves();
    const sameCell = NOC => selectedCountry === NOC;
    const mapLayout = {
        display: 'flex',
        alignItems: 'center'
    }
    return <div style={mapLayout}>
        <svg width={WIDTH} height={HEIGHT}>
            <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
                {leaves.map((d, idx) => {
                    const nameOfCountry = d.data.name;
                    return <g key={idx+"treemap"} transform={`translate(${d.x0}, ${d.y0})`}
                        onMouseOver={()=>{mouseOver(nameOfCountry)}} onMouseOut={mouseOut}>
                        <rect width={d.x1-d.x0} height={d.y1-d.y0} stroke={sameCell(nameOfCountry) ? 'black': 'none'}
                              strokeWidth={sameCell(nameOfCountry) ? '4px': '0'}
                              fill={color(d.data.value)} opacity={0.8}/>
                        <TreeMapText d={d}/>
                    </g>
                })}
            </g>
        </svg>
        <OverviewLegend width={legendWidth} height={legendHeight} tree={tree} color={color}
                        selectedCountry={selectedCountry}/>
    </div>;
}

function OverviewLegend(props) {
    const {width, height, tree, color, selectedCountry} = props;
    const innerWidth = width - MARGIN.left - MARGIN.right;
    const rectHeight = 10; // height of color legend bar
    const maxValue = d3.max(tree.children, d => d.value);
    let colors = [];
    for (let i = 0; i <= maxValue; ++i) {
      colors.push(color(i));
    }
    const ticks = color.ticks(6);
    const xScale = x => x / maxValue * innerWidth;
    const children = tree.children;
    const countryItem = c => children.filter(d => d.name === c)[0] || {name: c, value: null};  // cursor only for highlighted country
    const selectedValue = selectedCountry ? countryItem(selectedCountry).value : null;
    const cursorPath = v => {
        if (v) return `M ${xScale(v)-5} 15 L ${xScale(v)+5} 15 L ${xScale(v)} 23 Z`;
    }
    return <svg width={width} height={height}>
        <defs>
            <linearGradient id={`legend-${tree.type}`} x1={"0%"} y1={"0%"} x2={"100%"} y2={"0%"}>
                {colors.map((d, idx) => {
                    return <stop key={idx} offset={idx/maxValue} style={{stopColor:d, stopOpacity:0.8}} />
                })}
            </linearGradient>
        </defs>
        <g transform={`translate(${MARGIN.left}, 0)`}>
            <path d={cursorPath(selectedValue)} fill={'red'}/>
            <text style={{textAnchor:'middle', fontSize:'12px', fill:'red'}} x={xScale(selectedValue)} y={10}>
                {selectedValue}
            </text>
        </g>
        <g transform={`translate(${MARGIN.left}, 25)`}>
            <rect width={innerWidth} height={rectHeight} fill={`url(#legend-${tree.type})`} />
            {ticks.map(t => {
                return <g key={t}>
                    <line x1={xScale(t)} x2={xScale(t)} y1={0} y2={17} stroke={`black`} />
                    <text style={{textAnchor:'middle', fontSize:'12px'}} x={xScale(t)} y={32}>
                        {t}
                    </text>
                </g>
            })}
        </g>
    </svg>
}

function DetailTreeMap(props) {
    const {tree, color} = props;
    const innerWidth = WIDTH - MARGIN.left - MARGIN.right;
    const innerHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
    const legendWidth = 600;  // make sure do not overflow x-axis of screen
    const legendHeight = innerHeight-2*2;  // minus the padding of the tree map
    if (tree.children.length === 0) {
        return <svg width={WIDTH} height={HEIGHT}>
            <text fontSize={'3em'} x={innerWidth/2-MARGIN.left-MARGIN.right}
                  y={innerHeight/2+MARGIN.top+MARGIN.bottom}>No Record</text>
        </svg>
    }
    const root = d3.treemap().tile(d3.treemapBinary).size([innerWidth, innerHeight]).padding(2)
            .round(true)(d3.hierarchy(tree).sum(d => d.children ? 0 : d.value));
    const leaves = root.leaves();
    const mapLayout = {
        display: 'flex',
        alignItems: 'center'
    }
    return <div style={mapLayout}>
        <svg width={WIDTH} height={HEIGHT}>
            <g transform={`translate(${MARGIN.left}, ${MARGIN.top})`}>
                {leaves.map((d, idx) => {
                    return <g key={idx+"treemap"} transform={`translate(${d.x0}, ${d.y0})`}>
                        <rect width={d.x1-d.x0} height={d.y1-d.y0} stroke={'none'}
                              fill={color(d.data.name)} opacity={0.8}/>
                        <TreeMapText d={d}/>
                    </g>
                })}
            </g>
        </svg>
        <DetailLegend width={legendWidth} height={legendHeight} tree={tree} color={color}/>
    </div>;
}

function DetailLegend(props) {
    const {width, height, tree, color} = props;
    const flexStyle = {
        width: width,
        height: height,
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center',
        alignContent: 'center',
    }
    const dynamicConfig = n => {
        let padding, config;
        if (n>=40) {padding = 0; config = {height: 18, r: 5, margin: '3px 0', fontSize: 11};}
        else if (30<=n && n<40) {padding = 15; config = {height: 20, r: 7, margin: '3px 0', fontSize: 12};}
        else if (20<=n && n<30) {padding = 30; config = {height: 25, r: 9, margin: '5px 0', fontSize: 13};}
        else if (10<=n && n<20) {padding = 40; config = {height: 30, r: 10, margin: '5px 0', fontSize: 14};}
        else {padding = 40; config = {height: 40, r: 11, margin: '6px 0', fontSize: 14};}
        flexStyle.height -= padding;
        return config;
    };
    const config = dynamicConfig(tree.children.length);
    return <div style={flexStyle}>
        {tree.children.map(d => {
            let cx = config.r, cy = config.r, fontSize = config.fontSize;
            return <svg key={d.name} width={width/2-MARGIN.right} height={config.height}
                        transform={`translate(10, 0)`} style={{margin: config.margin}}>
                <g>
                    <circle fill={color(d.name)} r={config.r} cx={cx} cy={cy} />
                    <text style={{textAnchor: 'start', fontSize: config.fontSize + 'px', fontFamily: 'Trebuchet MS'}}
                          x={config.r+cx+10} y={cy+config.fontSize/2}>
                        {d.name}
                    </text>
                </g>
            </svg>
        })}
    </div>
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
    return <select title={'country'} defaultValue={selectedValue}
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
    const disciplineList = Array.from(new Set(aData.map(d => d.Discipline))).sort((a, b) => a.localeCompare(b));
    let mTreeJson = !detailCountry ? getOverviewTree(mData).slice(0, mMaxDisplay) :
        getDetailTree(mData.filter(d => d.NOC === detailCountry));  // sorted by number of medals
    let aTreeJson = !detailCountry ? getOverviewTree(aData).slice(0, aMaxDisplay) :
        getDetailTree(aData.filter(d => d.NOC === detailCountry));  // sorted by number of athletes
    let mTree = {name: 'root', children: mTreeJson, type: 'medal'};
    let aTree = {name: 'root', children: aTreeJson, type: 'athlete'};
    const mouseOver = n => {setSelectedCountry(n)};
    const mouseOut = () => {setSelectedCountry(null)};
    if (!detailCountry) {
        const mColor = d3.scaleSequential(d3.interpolateBlues).domain([0, d3.max(mTreeJson, d => d.value)]);
        const aColor = d3.scaleSequential(d3.interpolateGreens).domain([0, d3.max(aTreeJson, d => d.value)]);
        return <div>
            <ViewSwitch viewCountry={detailCountry} changeView={setDetailCountry}/>
            {/*Medal Tree Map*/}
            <TreeMapTitle text={'Number of Medals by Country'} />
            <DisplaySlider maxValue={mData.length} maxDisplay={mMaxDisplay} setMaxDisplay={setMMaxDisplay} />
            <OverviewTreeMap tree={mTree} color={mColor} selectedCountry={selectedCountry}
                             mouseOver={mouseOver} mouseOut = {mouseOut}/>
            {/*Athlete Tree Map*/}
            <TreeMapTitle text={'Number of Athletes by Country'} />
            <DisplaySlider maxValue={countryList.length} maxDisplay={aMaxDisplay} setMaxDisplay={setAMaxDisplay} />
            <OverviewTreeMap tree={aTree} color={aColor} selectedCountry={selectedCountry}
                             mouseOver={mouseOver} mouseOut = {mouseOut}/>
        </div>;
    } else {
        const mColor = d3.scaleOrdinal(['gold', 'silver', '#CD7F32']).domain(['Gold', 'Silver', 'Bronze']);
        const aColor = d3.scaleOrdinal(['#606f15', '#e9700a', '#977ab4', '#a54509', '#9e8c62', '#3cc4d9', '#d9bf01',
            '#fdc4bd', '#92a6fe', '#c9080a', '#78579e', '#81ffad', '#4ed1a5', '#d08f5d', '#1da49c', '#c203c8',
            '#94bc19', '#6e83c8', '#bbd9fd', '#888593', '#699ab3', '#f097c6', '#d24dfe', '#1cae05', '#e9700a',
            '#d3fe14', '#bb73a9', '#ccf6e9', '#10b0ff', '#b6a7d4', '#d3fe14', '#c9080a', '#d3fe14', '#fd9b39',
            '#606f15', '#a54509', '#fc8772', '#f097c6', '#d4ccd1', '#606f15', '#739400', '#7d5bf0', '#bbd9fd',
            '#73616f', '#297192', '#3957ff']).domain(disciplineList);
        return <div>
            <ViewSwitch viewCountry={detailCountry} changeView={setDetailCountry}/>
            <CountryDropdown options={countryList} selectedValue={detailCountry}
                             onSelectedValueChange={setDetailCountry} />
            {/*Medal Tree Map*/}
            <TreeMapTitle text={`Total Medals: ${!mTreeJson ? 0 : d3.sum(mTreeJson, d => d.value)}`} />
            <DetailTreeMap tree={mTree} color={mColor} />
            {/*Athlete Tree Map*/}
            <TreeMapTitle text={`Total Athletes: ${d3.sum(aTreeJson, d => d.value)}`} />
            <DetailTreeMap tree={aTree} color={aColor} />
        </div>;
    }
}

ReactDOM.render( <TokyoOlympics />, document.getElementById('root'));
