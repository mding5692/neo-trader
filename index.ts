/*-----------------------------------------------------------------------------
| Copyright (c) 2014-2015, PhosphorJS Contributors
|
| Distributed under the terms of the BSD 3-Clause License.
|
| The full license is in the file LICENSE, distributed with this software.
|----------------------------------------------------------------------------*/
'use strict';

import {
  Widget
} from 'phosphor-widget';

import {
  Menu, MenuBar, MenuItem
} from 'phosphor-menus';

import {
  DockPanel
} from '../lib/index';

import './index.css';


function createContent(title: string): Widget {
  let widget = new Widget();
  widget.addClass('content');
  widget.addClass(title.toLowerCase());
  widget.title.text = title;
  widget.title.closable = true;
  return widget;
}


function main(): void {

 /** let fileMenu = new Menu([
    new MenuItem({
      text: 'New File',
      shortcut: 'Ctrl+N',
      handler: logHandler
    }),
    new MenuItem({
      text: 'Open File',
      shortcut: 'Ctrl+O',
      handler: logHandler
    }),
    new MenuItem({
      text: 'Save As...',
      shortcut: 'Ctrl+Shift+S',
      handler: logHandler
    }),
    new MenuItem({
      type: MenuItem.Separator
    }),
    new MenuItem({
      text: 'Exit',
      handler: logHandler
    })
  ]);

  let editMenu = new Menu([
    new MenuItem({
      text: '&Undo',
      icon: 'fa fa-undo',
      shortcut: 'Ctrl+Z',
      handler: logHandler
    }),
    new MenuItem({
      text: '&Repeat',
      icon: 'fa fa-repeat',
      shortcut: 'Ctrl+Y',
      handler: logHandler
    }),
    new MenuItem({
      type: MenuItem.Separator
    }),
    new MenuItem({
      text: '&Copy',
      icon: 'fa fa-copy',
      shortcut: 'Ctrl+C',
      handler: logHandler
    }),
    new MenuItem({
      text: 'Cu&t',
      icon: 'fa fa-cut',
      shortcut: 'Ctrl+X',
      handler: logHandler
    }),
    new MenuItem({
      text: '&Paste',
      icon: 'fa fa-paste',
      shortcut: 'Ctrl+V',
      handler: logHandler
    })
  ]);

  let contextMenu = new Menu([
    new MenuItem({
      text: '&Copy',
      icon: 'fa fa-copy',
      shortcut: 'Ctrl+C',
      handler: logHandler
    }),
    new MenuItem({
      text: 'Cu&t',
      icon: 'fa fa-cut',
      shortcut: 'Ctrl+X',
      handler: logHandler
    }),
    new MenuItem({
      text: '&Paste',
      icon: 'fa fa-paste',
      shortcut: 'Ctrl+V',
      handler: logHandler
    })
  ]);

  let menuBar = new MenuBar([
    new MenuItem({
      text: 'File',
      submenu: fileMenu
    }),
    new MenuItem({
      text: 'Edit',
      submenu: editMenu
    })
  ]);

  menuBar.attach(document.body);

  document.addEventListener('contextmenu', (event: MouseEvent) => {
    event.preventDefault();
    let x = event.clientX;
    let y = event.clientY;
    contextMenu.popup(x, y);
  });
*/

  let r1 = createContent('Screen');

  let b1 = createContent('Charts');

  let y1 = createContent('Console');

  let panel = new DockPanel();
  panel.id = 'main';

  panel.insertLeft(r1);

  panel.insertRight(b1);
  panel.insertBottom(y1);

  panel.attach(document.body);

  window.onresize = () => { panel.update(); };
}


window.onload = main;
