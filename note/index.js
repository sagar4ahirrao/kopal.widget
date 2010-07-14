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

note.YUI2_LOADER_URI = 'http://yui.yahooapis.com/2.8.1/build/yuiloader/yuiloader-min.js';

//YUI is chosen as default since libraries are "hosted" by Yahoo CDN / Google Ajaxlibs.
note.implementations = [
  {name: 'html', display: 'HTML',
    parsers: [
      {name: 'yui2_simple', display: 'YUI Simple (default)'},
      {name: 'yui2', display: 'YUI advanced (not yet implemented)'},
      {name: 'tinymce', display: 'TinyMCE (not yet implemented)'},
      {name: 'ckeditor', display: 'CKEditor (not yet implemented'}
    ]},
  {name: 'markdown', display: 'Markdown (not yet implemented)',
    parsers: [
      {name: 'wmd', display: 'WMD (not yet implemented)'}
    ]}
  //Add more here
]

//It's YUI2-SimpleEditor for now.
//For Wiki Markup, show a preview area too like stackoverflow.
note.switchOnEditingEnvironment = function() {
  YUI().use('node', 'yui2-editor', function(Y){
    Y.one("body").setAttribute('class', 'yui-skin-sam');
    note.editor = new Y.YUI2.widget.SimpleEditor('Note', {
      height: '100px',
      width: '600px',
      /* dompath: true, */
      animate: true
    });
    note.editor.render();
  });
}

//Required while displaying.
//Show only "safe" html.
note.parseNote = function(text) {
  return text
}

note.main = function() {
  YUI().use('node', function(Y){
    note.canvas = Y.one('#WidgetCanvas');
    YUI().use('node', function(Y) {
      kopal.widget.GetRecord(null, 'syntax', function(response){
        note.syntax = response.responseText || 'html'
      })
      kopal.widget.GetRecord(null, 'parser', function(response){
        note.parser = response.responseText || 'ckeditor'
      })
    })
    if(kopal.widget.mode == 'edit')
      note.renderEdit();
    else
      note.renderDisplay();
  })
}

note.renderDisplay = function() {
  
}

note.renderEdit = function() {
  YUI().use('node', 'event', function(Y){
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
        ajaxOptions: {method: 'put'}
      });
    });
    note.addAdvancedOptions();
    //TODO: Get it inside heading block, becuase sometimes it appears over "Heading".
    kopal.widget.GetRecord(null, 'note', function(response){
      var note_tag = Y.Node.create("<textarea></textarea>");
      var submit_tag = Y.Node.create("<button></button");
      note_tag.setAttribute('id', 'Note');
      note_tag.set('innerHTML', response.responseText || 'Enter note here.');
      submit_tag.setAttribute('id', 'Submit');
      submit_tag.set('innerHTML', 'Save note');
      Y.one('#WidgetCanvas').appendChild(note_tag);
      Y.one('#WidgetCanvas').appendChild(submit_tag);
      submit_tag.on('click', note.saveNote);
      note.switchOnEditingEnvironment();
    });
  });
}

note.addAdvancedOptions = function() {
  YUI().use('node', function(Y) {
    //Show advanced options.
    //Hide advanced options.
    //
    // Markup (<select>) - HTML (default), Markdown, ....
    // Environment (<select>) - YUI (default), ....
    var advanced_link = Y.Node.create('<a></a>');
    advanced_link.setAttribute('onclick', '')
  })
}

//TODO: Next to "Save note" button highlight "Saved." with yellow background for a few seconds.
note.saveNote = function() {
  YUI().use('node', function(Y){
    var note_tag = Y.one('#Note');
    note.editor.saveHTML();
    kopal.widget.UpdateRecord(null, 'note', note_tag.get('value'), function(){});
  })
}

note.main();