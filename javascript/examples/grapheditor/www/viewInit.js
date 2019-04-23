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

    //子菜单是否自动展开
    graph.popupMenuHandler.autoExpand = true;
    // 生成菜单
    graph.popupMenuHandler.factoryMethod = factoryMethod;
    //禁用浏览器自带右键菜单
    mxEvent.disableContextMenu(container);

    return graph
};

//预先将Graph里的默认方法覆盖到mxgraph中
var waitConvertMethodNames=["isReplacePlaceholders","sanitizeHtml","getLinksForState"];
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
    mxGraph.prototype["convertValueToString"]=diyConvertValueToString;


}
function diyConvertValueToString(cell)
{
    if(cell.value==undefined){
        return "";
    }

    if (cell.value != null && typeof(cell.value) == 'object')
    {
        if (this.isReplacePlaceholders(cell) && cell.getAttribute('placeholder') != null)
        {
            var name = cell.getAttribute('placeholder');
            var current = cell;
            var result = null;

            while (result == null && current != null)
            {
                if (current.value != null && typeof(current.value) == 'object')
                {
                    result = (current.hasAttribute(name)) ? ((current.getAttribute(name) != null) ?
                        current.getAttribute(name) : '') : null;
                }

                current = this.model.getParent(current);
            }

            return result || '';
        }
        else
        {
            return cell.value.getAttribute('label') || '';
        }
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

function factoryMethod(menu, cell, evt) {
    if(!cell){
        return
    }
    menu.addItem('Item 1', null, function()
    {
        alert('Item 1');
    });

    menu.addItem('Item 2', null, function()
    {
        alert('Item 2');
    });

    menu.addSeparator();

    var submenu1 = menu.addItem('Submenu 1', null, null);

    menu.addItem('Subitem 1', null, function()
    {
        alert('Subitem 1');
    }, submenu1);
    menu.addItem('Subitem 1', null, function()
    {
        alert('Subitem 2');
    }, submenu1);
}