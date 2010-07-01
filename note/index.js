if(!kopal)
  var kopal = {};

if(!kopal.widget)
  kopal.widget = {};

if(!kopal.widget.gallery)
  kopal.widget.gallery = {};

//if(!kopal.widget.gallery.com)
//  kopal.widget.gallery.com = {};
//
//if(!kopal.widget.gallery.com.googlecode)
//  kopal.widget.gallery.com.googlecode = {}
//
//if(!kopal.widget.gallery.com.googlecode.kopal)
//  kopal.widget.gallery.com.googlecode.kopal = {}

if(!kopal.widget.gallery.kopal_googlecode_com)
  kopal.widget.gallery.kopal_googlecode_com = {}; //This is probably a place where under_score should be preferred.

kopal.widget.gallery.kopal_googlecode_com.note = {};
var note = kopal.widget.gallery.kopal_googlecode_com.note;

note.main = function() {
  YUI().use('node', function(Y){
    note.canvas = Y.one('#WidgetCanvas');
    if(kopal.widget.mode == 'edit')
      note.renderEdit();
    else
      note.renderDisplay();
  })
}

note.renderDisplay = function() {
  
}

note.renderEdit = function() {
  YUI().use('node', function(Y){
    kopal.widget.GetRecord(null, 'heading', function(response){
      var heading_tag = Y.Node.create("<h2></h2>");
      heading_tag.setAttribute('id', 'Heading');
      heading_tag.set('innerHTML', response.responseText || '[Heading]');
      //Error: Node cannot be inserted at the specified point in the hierarchy" code: "3
      //Why note.canvas not defined here? (10-June-2010)
      //Update 15-June-2010, both Firefox/Firebug and Google Chrome now fail silently without
      //giving any error and also do not execute any code after following line. What changed since 10-June? Added
      //and now calling within kopal.widget.GetRecord(), before following line was called from function passed
      //to YUI().use()
      //What's wrong?
      //note.canvas.appendChild(heading_tag);
      //Both return always same string - in format of - DIV#WidgetCanvas yui_3_1_1_3_12766162246416
      //alert(note.canvas)
      //alert(Y.one('#WidgetCanvas'))
      Y.one('#WidgetCanvas').appendChild(heading_tag);
      new Ajax.InPlaceEditor('Heading', kopal.widget.GetRecordActionUrl(null, 'heading'), {
        ajaxOptions: { method: 'put'}
      })
    })
  });
}

note.main();