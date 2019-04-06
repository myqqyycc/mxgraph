function MyViewGraph(container,xmlStr)
{
    convertGraphMethodToMx();

    var xmlDocument = $.parseXML(xmlStr);
    var decoder = new mxCodec(xmlDocument);
    var node = xmlDocument.documentElement;



    var graph = new mxGraph(container);

    //加载默认样式
    decoder.decode(mxUtils.load('/page/examples/grapheditor/www/styles/default.xml').getDocumentElement(), graph.getStylesheet());

    graph.centerZoom = false;
    graph.setTooltips(true);
    graph.setEnabled(true);
    graph.setEdgeLabelsMovable(true)

// Enables panning with left mouse button
    graph.panningHandler.useLeftButtonForPanning = true;
    graph.panningHandler.ignoreCell = false;
    graph.container.style.cursor = 'move';
    // graph.setCellsLocked(true)
    // graph.setMultigraph(false);
    graph.setPanning(true);

    decoder.decode(node, graph.getModel());
    graph.resizeContainer = false;

    graph.setTooltipForCell=setTooltipForCell;

    return graph
};

//预先将Graph里的默认方法覆盖到mxgraph中
var waitConvertMethodNames=["convertValueToString","isReplacePlaceholders","sanitizeHtml","getLinksForState"];
function convertGraphMethodToMx() {
    waitConvertMethodNames.forEach(function (methodName) {
        mxGraph.prototype[methodName]=Graph.prototype[methodName];
    })

    mxGraph.prototype["getTooltipForCell"]= function(cell){
        if( cell&&cell.value&&cell.value.hasAttribute('tooltip')){
            return cell.value.getAttribute('tooltip');
        }
        return this.convertValueToString(cell)
    }
}
//重定义Tooltip父容器mxTooltip的样式
mxTooltipHandler.prototype.init = function()
{
    if (document.body != null)
    {
        this.div = document.createElement('div');
        this.div.className = 'mxTooltip';
        this.div.style.visibility = 'hidden';
        this.div.style.filter="alpha(Opacity=60)";
        this.div.style["-moz-opacity"]=0.6;
        this.div.style["opacity"]=0.6;

        document.body.appendChild(this.div);

        mxEvent.addGestureListeners(this.div, mxUtils.bind(this, function(evt)
        {
            this.hideTooltip();
        }));
    }
};

mxGraph.prototype.isCellLocked = function(cell)
{
    return cell.isEdge();
};

//重定义获取Tooltip方法
function setTooltipForCell(cell,value)
{
    if(cell&&cell.value){
        cell.value.setAttribute('tooltip',value)
        return true;
    }
    return false;
};

var urlParams = (function(url)
{
    var result = new Object();
    var idx = url.lastIndexOf('?');

    if (idx > 0)
    {
        var params = url.substring(idx + 1).split('&');

        for (var i = 0; i < params.length; i++)
        {
            idx = params[i].indexOf('=');

            if (idx > 0)
            {
                result[params[i].substring(0, idx)] = params[i].substring(idx + 1);
            }
        }
    }

    return result;
})(window.location.href);
