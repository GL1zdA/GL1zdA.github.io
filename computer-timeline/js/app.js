var ComputerTimeline = (function () {
	function setColor(json, color) {
		for (var i = 0; i < json.events.length; i++) {
			json.events[i].color = color;
		}
		return json;
	}

	function load(timeline, eventSource, json, color) {
		timeline.loadJSON(json + "?" + (new Date().getTime()), function (json, url) {
			if (color == undefined) {
				eventSource.loadJSON(json, url);
			} else {
				eventSource.loadJSON(setColor(json, color), url);
			}
		});
	}

	return {
		builder: function (idParam, dateGiven) {
			return (function () {
				var id = idParam;
				var bandInfos = [];
				var eventSources = [];
				var data = [];
				var date = Timeline.DateTime.parseGregorianDateTime(dateGiven);
				var theme = Timeline.ClassicTheme.create();
				theme.event.bubble.width = 450;
				theme.event.bubble.height = 300;// to jakoś dziwnie działa, bo musiałem dodać do styli
				return {
					addBand: function (height) {
						var eventSource = new Timeline.DefaultEventSource(0);
						bandInfos.push(Timeline.createBandInfo({
							width: height,
							intervalUnit: Timeline.DateTime.YEAR,
							intervalPixels: 300,
							eventSource: eventSource,
							date: date,
							theme: theme,
							layout: 'original'  // original, overview, detailed
						}));
						eventSources.push(eventSource);
						data.push([]);
						if (bandInfos.length > 1) {
							bandInfos[bandInfos.length - 2].syncWith = bandInfos.length - 1;
						}
						return this;
					},
					addData: function (json, color) {
						data[bandInfos.length - 1].push({json: json, color: color});
						return this;
					},
					build: function () {
						var tl = Timeline.create(document.getElementById(id), bandInfos, Timeline.HORIZONTAL);
						for (var i = 0; i < bandInfos.length; i++) {
							for (var j = 0; j < data[i].length; j++) {
								load(tl, eventSources[i], data[i][j].json, data[i][j].color);
							}
						}
						return tl;
					}
				};
			})();
		}
	};
})();
