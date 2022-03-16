//#region @notForNpm
//#region @browser
import { NgModule } from '@angular/core';
import { Component, OnInit } from '@angular/core';

@Component({
selector: 'app-tnp-cli',
template: 'hello from tnp-cli'
})
export class TnpCliComponent implements OnInit {
constructor() { }

ngOnInit() { }
}

@NgModule({
imports: [],
exports: [TnpCliComponent],
declarations: [TnpCliComponent],
providers: [],
})
export class TnpCliModule { }
//#endregion

//#region @backend
async function start(port: number)  {

}

export default start;

//#endregion

//#endregion