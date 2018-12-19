import { Component, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { ViewEncapsulation } from '@angular/core';
import { SchoolDataService } from './management/school/school-data.service';
import { UserAccountDataService } from './user-account/user-account-data.service';
import { UserRoleDataService } from './user/user-role/user-role-data.service';
import { mainMenu, subMenu, sMenu } from './menus';
import { AcademicsComponent } from './academics/academics.component';
import { filter } from 'rxjs/operators';

declare var $:JQueryStatic;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css', './sidebar.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class AppComponent {
  public isCollapsed = false;
  public curMenuTitle = "Home";
  public mainMenu;
  title = 'Greenchalk Admin!';
  curMenuName = 'DASH';
  pulled = false;
  @ViewChild('classes') classes:AcademicsComponent;
  // @ViewChild(AcademicsComponent);
  // private classes: AcademicsComponent;

	constructor(private router: Router,
              private route: ActivatedRoute,
              private location: Location,
              public schoolDataService: SchoolDataService,
              public userAccountDataService: UserAccountDataService,
              public userRoleDataService: UserRoleDataService) {
                this.mainMenu = mainMenu;
                router.events.subscribe((val) => {
                    (<any>$('body > div.modal')).remove();
                });
              }

	ngAfterViewInit() {
    let path = this.location.path();
    if(path.includes('/login/')){
      let institution_id = path.split('/')[2];
      this.router.navigate(['/login/'+institution_id]);
    }
    else{
	    this.router.navigate(['/login']);
    }
	}

  public goToDash(){
    this.router.navigate(['/home']);
  }

  isLoggedIn() {
    return this.userRoleDataService.permissions && this.userRoleDataService.permissions.length > 0;
  }

  isMenuSelected(menuName) {
    return this.curMenuName == menuName;
  }

  isSmenuSelected(menuName: string) {
    let curName = this.curMenuName;
    let retval:any = false;
    mainMenu.forEach(function(menu) {
      menu.children.forEach(function(smenu) {
        smenu.children.forEach(function(ssmenu) {
          if ((smenu.access == menuName || menu.access == menuName) && ssmenu.access == curName)
            retval = true;
        });
        if (menu.access == menuName && smenu.access == curName)
          retval = true;
      });
    });
    return retval;
  }

  onMenuSelect(menuName, menuTitle) {
    // let smenuSel = 0;
    // mainMenu.forEach(function(menu) {
    //   menu.children.forEach(function(smenu) {
    //     smenu.children.forEach(function(ssmenu) {
    //       if (smenuSel == 0 && ssmenu.access == menuName)
    //         smenuSel = 1;
    //     });
    //     if (smenuSel == 0 && smenu.access == menuName)
    //       smenuSel = 1;
    //   })
    // })
    // if (!smenuSel)
    //   (<any>$('.collapse')).collapse('hide');
    this.curMenuTitle = menuTitle;
    this.curMenuName = menuName;
  }

  pullMenu() {
    this.pulled = true;
  }

  pushMenu() {
    this.pulled = false;
  }

  isPulled() {
    return this.pulled;
  }

  addClass() {
      // this.router.events.pipe(
      //   filter(event => event instanceof NavigationEnd)
      // )
      // .subscribe((event) => {
      //     console.log(event['url']);
      //     console.log(this.route.firstChild.routeConfig.path);
      // });
  }

	logout() {
     window.location.replace('/');
  }
}
