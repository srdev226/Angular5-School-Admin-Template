import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { SchoolDataService } from '../school/school-data.service';
import { SchoolService } from '../school/school.service';
import { School, Class, Divisions, AcademicYear } from '../school/school';
import { ClassInfoService } from '../../academics/classes/class-info.service';
import { ClassInfo, Division, Subject, ConstituentSubject } from '../../academics/classes/class-info';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
@Component({
  selector: 'manage-subjects',
  templateUrl: './manage-subjects.component.html',
  styleUrls: ['./manage-subjects.component.css'],
})

export class ManageSubjectsComponent implements OnInit {

  expand_all = false;
  sel_aca_year_name: string;
  academic_years: any;
  selected_academic_year: string;
  school: School;
  classes: ClassInfo[];
  all_classes: ClassInfo[];
  selected_class: ClassInfo;
  new_subject_class: ClassInfo;
  new_subject_classes: ClassInfo[];
  divisions: boolean[];
  is_expanded: boolean[];
  selected_group: string;
  selected_subjects: string;
  groupable_subjects: any;
  addable_subjects: any;
  group_subjects: any;
  new_subject_year: string;
  new_subjects: any;
  selected_subject_id: number;
  selected_constituent_subject_id: number;
  new_group_name: string;
  selected_group_code: string;
  unmerge_index: number;
  is_details_loaded: boolean;
  splited_subjects: ConstituentSubject[];
  selected_subject_code: string;
  selected_subject_weightage: number;

  constructor(private router: Router,
  						private schoolDataService: SchoolDataService,
  						private classInfoService: ClassInfoService,
              public toastr: ToastsManager,
              public schoolService: SchoolService,
              vcr: ViewContainerRef) {
                this.toastr.setRootViewContainerRef(vcr);
              }

  ngOnInit() {
    this.is_details_loaded = false;
  	this.school = this.schoolDataService.getSchool();
    this.academic_years = this.school.academic_years;
    this.selected_academic_year = this.new_subject_year = this.academic_years[this.academic_years.length - 1].code;
    this.sel_aca_year_name = this.selected_academic_year;
    this.selected_class = null;
    this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
      this.all_classes = resp.filter(x => (x.type === "regular"));
      this.loadClass();
    });
  }

  loadClass() {
    this.groupable_subjects = [];
    this.group_subjects = [];
    this.formatClasses();
    this.is_details_loaded = true;
  }
 
  formatClasses() {
    this.classes = this.all_classes.filter(x => (x.academic_year == this.selected_academic_year));
    this.classes.sort(function(a,b){
      return (a.order_index) - (b.order_index);
    });
    if (this.selected_class != null) {
      this.is_details_loaded = false;
      this.selected_class = this.classes.find(x => (x.class_info_key == this.selected_class.class_info_key));
      this.formatGroupableSubjects();
      this.is_details_loaded = true;
    }
  }

  formatExpanded() {
    this.is_expanded = [];
    this.selected_class.subjects.forEach(sub => {
      this.is_expanded.push(false);
    });
  }

  formatDatas() {
    this.is_details_loaded = false;
    this.formatGroupableSubjects();
    // this.formatExpanded();
    this.is_details_loaded = true;
  }

  formatGroupableSubjects() {
    this.groupable_subjects = [];
    this.group_subjects = [];
    if (typeof this.selected_class.subjects != 'undefined' && this.selected_class.subjects.length > 0) {
      this.selected_class.subjects.forEach(subject => {
        if (!this.isConstituentSubject(subject.code)) {
          this.groupable_subjects.push({grouped: false, subject: subject});
        }
      })
    }
    this.school.academic_configuration.subjects.forEach(subject => {
      let found = this.selected_class.subjects.find(sub => (sub.code == subject.code));
      if (typeof found != 'undefined' || found) return;
      this.group_subjects.push(subject);
    });
    this.formatExpanded();
  }

  isConstituentSubject(code, selected_class = null) {
    let retval = false;
    this.selected_class.subjects.forEach(sub => {
      if (typeof sub.constituent_subjects == 'undefined' || sub.constituent_subjects.length == 0) {
        return;
      }
      if (typeof sub.constituent_subjects.find(sb => (sb.code == code)) == 'undefined')
        return;
      retval = true;
    });
    return retval;
  }

  hasConstituentSubject(code, selected_class = null) {
    let subject;
    if (selected_class == null) subject = this.selected_class.subjects.find(sub => (sub.code == code));
    else  subject = selected_class.subjects.find(sub => (sub.code == code));
    if (typeof subject == 'undefined' || typeof subject.constituent_subjects == 'undefined' || subject.constituent_subjects.length == 0) return false;
    return true;
  }

  public getSplitedSubjects(code) {
    let subject = this.selected_class.subjects.find(sub => (sub.code == code));
    if (typeof subject.constituent_subjects == 'undefined' || subject.constituent_subjects.length == 0) return [];
    return this.splited_subjects = subject.constituent_subjects;
  }

  getGroupSubjectCode(code, constituent_subjects) {
    let retval = code;
    for (let i = 0; i < constituent_subjects.length; i ++) {
      if (i > 1) continue;
      if (i == 1) {
        retval += '..';
        continue;
      }
      retval += ', ';
      retval += constituent_subjects[i].code;
    }
    return retval;
  }

  toggleExpand(index) {
    this.is_expanded[index] = !this.is_expanded[index];
    if (typeof this.is_expanded.find(el => (el == false)) != 'undefined') this.expand_all = false; 
  }

  expandAll() {
    if (this.expand_all) {
      (<any>$('.table-contents .collapse')).collapse('show');
    }
    else {
      (<any>$('.table-contents .collapse')).collapse('hide');
    }
    for (let i = 0; i < this.is_expanded.length; i ++)
      this.is_expanded[i] = this.expand_all;
  }

  selectGroupSubjects(index) {
    this.groupable_subjects[index].grouped = !this.groupable_subjects[index].grouped;
    let selected_subjects = this.groupable_subjects.filter(subject => (subject.grouped == true));
    if (typeof selected_subjects == 'undefined' || selected_subjects.length == 0) {
      this.selected_subjects = 'Select subjects for this group';
      return;
    }
    this.selected_subjects = '';
    for (let i = 0; i < selected_subjects.length; i ++){
      if (i > 4) continue;
      if (i == 4) {
        this.selected_subjects += '..';
        continue;
      }
      if (i != 0) this.selected_subjects += ', ';
      this.selected_subjects += selected_subjects[i].subject.code;
    }
  }

  validateAddClass() {
    let retval: boolean = true;
    this.new_subjects.forEach(subject => {
      if (subject.subject_name == null || subject.subject_weightage == null) {
        retval = false;
        return;
      }
    })
    if (!retval)
      this.showNotification('error', 'You have to input * field!');
    return retval;
  }

  addClass() {
    if (!this.validateAddClass()) return;
    this.is_details_loaded = false;
    let is_new_subject_added = false;
    this.new_subjects.forEach(subject => {
      let name = subject.subject_name;
      if (name == 'Add New Subject') {
        name = subject.new_name;
        this.school.academic_configuration.subjects.push({code: subject.subject_code, name: name});
        is_new_subject_added = true;
      }
      this.new_subject_class.subjects.push(<any>{
        name: name,
        code: subject.subject_code,
        weightage: subject.subject_weightage,
        type: "MANDATORY",
      });
    })
    if (is_new_subject_added) {
      this.schoolService.updateSchool(this.school).then(res => {
        this.schoolDataService.setSchool(this.school);
        this.saveClass(this.new_subject_class, 'New subjects have been added successfully!', 'Error has been occurred while adding new subjects!');
      }).catch(res => {
        this.getClassAndFormat();
        this.showNotification('error', 'Error has been occurred while adding new subjects!')
      });
    }
    else {
      this.saveClass(this.new_subject_class, 'New subjects have been added successfully!', 'Error has been occurred while adding new subjects!');
    }
  }
  
  getClassAndFormat() {
    this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
      this.all_classes = resp.filter(x => (x.type === "regular"));
      (<any>$('body > div.modal')).remove();
      this.formatClasses();
    });
  }

  validateGroupClass() {
    let retval: boolean = true;
    let subject = this.groupable_subjects.find(subject => (subject.grouped));
    if (typeof subject == 'undefined' || !subject)
      retval = false;
    if (this.selected_group == 'Select subject group title')
      retval = false;
    if (this.selected_group == 'Other' && !this.new_group_name)
      retval = false;
    if (!retval)
      this.showNotification('error', 'You have to input * field!');
    return retval;
  }

  groupClass() {
    if (!this.validateGroupClass()) return;
    this.is_details_loaded = false;
    let tmp_class = this.selected_class;
    if (this.selected_group != 'Other') {
      tmp_class.subjects.push(<any>{
        name: this.selected_group,
        constituent_subjects: [],
        type: "MANDATORY", 
        code: this.selected_group_code,
        weightage: 0,
      });
    }
    else {
      let code = this.new_group_name.slice(0, 3).toLowerCase();
      let num: any = 1;
      this.school.academic_configuration.subjects.forEach(subject => {
        if (subject.code.slice(0, 3) == code) num ++;
      })
      code = code + (num < 10 ? ("0" + num) : num);
      tmp_class.subjects.push(<any>{
        name: this.new_group_name,
        constituent_subjects: [],
        type: "MANDATORY", 
        code: code,
      });
      this.school.academic_configuration.subjects.push({name: this.new_group_name, code: code});
    }
    let total_weightage = 0;
    this.groupable_subjects.forEach(subject => {
      if (subject.grouped) {
        let weightage = typeof subject.subject.weightage == 'undefined' ? 100 : subject.subject.weightage;
        total_weightage += weightage;
        tmp_class.subjects[tmp_class.subjects.length - 1].constituent_subjects.push({code: subject.subject.code, weightage: weightage});
        let index = tmp_class.subjects.indexOf(subject.subject);
      }
    });
    tmp_class.subjects[tmp_class.subjects.length - 1].weightage = total_weightage;
    if (this.selected_group != 'Other') {
      this.saveClass(tmp_class, 'Subject has been grouped successfully!', 'Error has been occurred while grouping subject!');
    }
    else {
      this.schoolService.updateSchool(this.school).then(res => {
        this.schoolDataService.setSchool(this.school);
        this.saveClass(tmp_class, 'Subject has been grouped successfully!', 'Error has been occurred while grouping subject!');
      }).catch(res => {
        this.getClassAndFormat();
        this.showNotification('error', 'Error has been occurred while grouping subject!');
      });      
    }
  }

  saveClass(modified_class, success_msg, error_msg) {
    this.classInfoService.updateClassInfo(modified_class).then(res => {
      this.getClassAndFormat();
      this.showNotification('success', success_msg);
      this.closeModal();
    }).catch(() => {
      this.getClassAndFormat();
      this.showNotification('error', error_msg);
    });
  }

  generateSubjectCode(index) {
    if (this.new_subjects[index].new_name == null || this.new_subjects[index].new_name.length == 0) {
      this.new_subjects[index].subject_code = null;
      return;
    }
    let code = this.new_subjects[index].new_name.slice(0, 3).toLowerCase();
    let num: any = 1;
    this.new_subjects.forEach(subject => {
      if (subject.subject_code && subject.subject_code.slice(0, 3) == code) num ++;
    });
    this.school.academic_configuration.subjects.forEach(subject => {
      if (subject.code.slice(0, 3) == code) num ++;
    })
    if (num < 10) num = "0" + num;
    this.new_subjects[index].subject_code = code + num;
  }

  addAnotherSubject() {
    this.new_subjects.push({subject_name: null, new_name: null, subject_code: null, subject_weightage: null});
  }

  getSubName(sub_code) {
    return this.school.academic_configuration.subjects.find(subject => (subject.code == sub_code)).name;
  }

  getMarksWeightage(subject:Subject) {
    if (typeof subject.weightage != 'undefined') return subject.weightage;
    let total_weightage = 0;
    subject.constituent_subjects.forEach(subject => {
      if (typeof subject.weightage != undefined && subject.weightage != null)
        total_weightage += subject.weightage;
    })
    if (total_weightage == 0) return null;
    return total_weightage;
  }

  getWeightageFromSubject(subject) {
    if (typeof subject.weightage == 'undefined') return 'XX';
    return  subject.weightage;
  }

  formatNewSubjects() {
    this.new_subjects = [];
    this.new_subjects.push({subject_name: null, new_name: null, subject_code: null, subject_weightage: null});
  }

  formatWeightage() {
    for (let i = 0; i < this.selected_class.subjects.length; i ++) {
      if (!this.isConstituentSubject(this.selected_class.subjects[i].code))
        this.setSubjectWeightage(this.selected_class, i);
    }   
  }    

  setSubjectWeightage(selected_class, index) {
    if (this.hasConstituentSubject(selected_class.subjects[index].code)) {
      this.selected_class.subjects[index].weightage = 0;
      selected_class.subjects[index].constituent_subjects.forEach(subject => {
        let sub = selected_class.subjects.find(sb => (sb.code == subject.code));
        subject.weightage = this.setSubjectWeightage(selected_class, selected_class.subjects.indexOf(sub));
        selected_class.subjects[index].weightage += subject.weightage;
      })
    }
    return this.selected_class.subjects[index].weightage;
  }

  removeSubjects(selected_class, code) {
    let subject = selected_class.subjects.find(sub => (sub.code == code));
    if (this.hasConstituentSubject(code, selected_class)) {
      let len = subject.constituent_subjects.length;
      for (let i = 0; i < len; i ++) {
        selected_class = this.removeSubjects(selected_class, subject.constituent_subjects[len - i - 1].code);
      }
    }
    if (this.isConstituentSubject(code, selected_class)) {
      selected_class.subjects.forEach(sub => {
        if (this.hasConstituentSubject(sub.code, selected_class)) {
          let sbj = sub.constituent_subjects.find(sb => (sb.code == code));
          if (typeof sbj != 'undefined') {
            sub.constituent_subjects.splice(sub.constituent_subjects.indexOf(sbj), 1);
          }
        }
        if (typeof sub.constituent_subjects != 'undefined' && sub.constituent_subjects.length == 0)
          selected_class.subjects.splice(selected_class.subjects.indexOf(sub), 1);
      });
    }
    subject = selected_class.subjects.find(sub => (sub.code == code));
    if (typeof subject != 'undefined')
      selected_class.subjects.splice(selected_class.subjects.indexOf(subject), 1);
    return selected_class;
  }

  removeSubjectFromDB() {
    let code = this.selected_subject_code;
    this.is_details_loaded = false;
    this.selected_class = this.removeSubjects(this.selected_class, code);
    this.formatWeightage();
    this.classInfoService.updateClassInfo(this.selected_class).then(res => {
      this.getClassAndFormat();
      this.showNotification('success', 'Subject has been removed successfully!');
      this.closeModal();
    }).catch(() => {
      this.getClassAndFormat();
      this.showNotification('error', 'Error has been occurred while removing subject!')
    });
  }

  onLiSelect(type, first = null, second = null){
    switch (type) {
      case "academic year":
        this.selected_academic_year = first;
        this.sel_aca_year_name = second;
        this.loadClass();
        break;  

      case "class":
        this.selected_class = first;
        this.formatDatas();
        setTimeout(() => {
          this.setDropDown()
        }, 300);
        break;

      case "subject_name":
        this.selected_group = first;
        this.selected_group_code = second;
        break;

      case "new_subject_academic_year":
        this.new_subject_year = first;
        this.new_subject_class = null;
        this.addable_subjects = [];
        this.formatNewSubjects();
        this.new_subject_classes = this.all_classes.filter(x => (x.academic_year == this.new_subject_year));
        this.new_subject_classes.sort(function(a,b){
          return (a.order_index) - (b.order_index);
        });
        break;

      case "new_subject_class":
        if (this.new_subject_class == this.new_subject_classes[first]) return;
        this.formatNewSubjects();
        this.new_subject_class = this.new_subject_classes[first];
        this.school.academic_configuration.subjects.forEach(subject => {
          if (typeof this.new_subject_class.subjects != 'undefined' && this.new_subject_class.subjects.length != 0){
            let found = this.new_subject_class.subjects.find(sub => (sub.code == subject.code));
            if (typeof found != 'undefined' || found) return;
            let retval = true;
            this.new_subject_class.subjects.forEach(sub => {
              if (typeof sub.constituent_subjects !== 'undefined' && sub.constituent_subjects.length > 0) {
                found = <any>sub.constituent_subjects.find(x => (x.code == subject.code));
                if (typeof found != 'undefined' || found) {
                  retval = false;
                  return;
                }
              }
            })
            if (!retval) return;
          }
          this.addable_subjects.push(subject);
        });
        break;

      case "select_subject":
        this.new_subjects[first].subject_name = this.addable_subjects[second].name;
        this.new_subjects[first].subject_code = this.addable_subjects[second].code;
        break;

      case "add_new_subject":
        this.new_subjects[first].subject_name = 'Add New Subject';
        this.new_subjects[first].subject_code = null;
        break;

      case "remove_subject":
        // this.selected_subject_id = first;
        // this.selected_constituent_subject_id = second;
        this.selected_subject_code = first;
        this.openModal('remove-subject-modal');
        break;

      case "split_subject":
        break;
    }
  }

  openModal(modal_name, first = null) {
    switch (modal_name) {
      case "group-subjects-modal":
        this.selected_group = 'Select subject group title';
        this.selected_subjects = 'Select subjects for this group';
        this.new_group_name = null;
        this.groupable_subjects.forEach(subject => {
          subject.grouped = false;
        })
        break;
      
      case 'add-subject-modal':
        this.new_subject_class = null;
        this.addable_subjects = [];
        this.new_subject_year = this.sel_aca_year_name;
        this.new_subject_classes = this.all_classes.filter(x => (x.academic_year == this.new_subject_year));
        this.new_subject_classes.sort(function(a,b){
          return (a.order_index) - (b.order_index);
        });
        this.formatNewSubjects();
        break;

      case 'ungroup-subjects-modal':
        this.unmerge_index = first;
        break;

      case 'edit-weightage':
        this.selected_subject_code = first;
        this.selected_subject_weightage = this.selected_class.subjects.find(x => (x.code == first)).weightage;
        break;
    }
    (<any>$('#' + modal_name)).appendTo('body').modal();
    setTimeout(() => { this.setDropDown()}, 800);
  }

  closeModal() {
    let element = (<any>$('.modal')).modal('hide');
  }

  editMarksWeightage() {
    if (this.selected_subject_weightage == null) {
      this.showNotification('error', 'You have to input * field!');
      return;
    }
    this.selected_class.subjects.find(x => (x.code == this.selected_subject_code)).weightage = this.selected_subject_weightage;
    this.formatWeightage();
    this.classInfoService.updateClassInfo(this.selected_class).then(res => {
      this.classInfoService.getClassInfoList(this.school.school_id).then(resp => {
        this.all_classes = resp.filter(x => (x.type === "regular"));
        this.showNotification('success', 'Marks weightage has been edited successfully!');
        this.closeModal();
      })
    }).catch(() => {
      this.getClassAndFormat();
      this.showNotification('error', 'Error has been occurred while updating marks weightage!')
    });
  }

  unGroupSubjects() {
    this.is_details_loaded = false;
    let tmp_class = this.selected_class;
    tmp_class.subjects.splice(this.unmerge_index, 1);
    this.classInfoService.updateClassInfo(tmp_class).then(res => {
      this.getClassAndFormat();
      this.showNotification('success', 'Subject has been removed successfully!');
      this.closeModal();
    }).catch(() => {
      this.getClassAndFormat();
      this.showNotification('error', 'Error has been occurred while removing subject!')
    });
    this.formatDatas();
  }

  removeSubject(type, i) {
    switch (type) {
      case "group-subject":
        
        break;
      
      case "add-subject":
        if (i > -1) {
          let code = this.new_subjects[i].subject_code ? this.new_subjects[i].subject_code.slice(0, 3) : null;
          this.new_subjects.splice(i, 1);
          if (code != null) {
            let num = 1;
            this.school.academic_configuration.subjects.forEach(subject => {
              if (subject.code.slice(0, 3) == code) num ++;
            })
            this.new_subjects.forEach(subject => {
              if (subject.subject_code && subject.subject_code.slice(0, 3) == code) {
                let tmp: any = num < 10 ? ('0' + num) : num;
                subject.subject_code = code + num;
                num ++;
              }
            });
          }
        }
        break;
    }
  }

  getSelectedClassName() {
		if (this.selected_class) {
			return "Class " + this.selected_class.name;
		}	
		return "Select Class";
  }

  setDropDown() {
    $('.check-dropdown li').on('click', function (event) {
      console.log(111);
      $(this).parent().addClass('open');
    });

    $('body').on('click', function (e) {
      if (!$('ul.dropdown-menu.check-dropdown').is(e.target) 
        && $('ul.dropdown-menu.check-dropdown').has(e.target).length === 0 
        && $('.open').has(e.target).length === 0
      ) {
        $('.check-dropdown').removeClass('open');
      }
    });
  }

  private showNotification(type, message) {
    switch (type) {
      case "success":
        this.toastr.success(message, 'Success!');
        break;
      case "error":
        this.toastr.error(message, 'Oops!');
        break;
      case "warning":
        this.toastr.warning(message, 'Alert!');
        break;
      case "info":
        this.toastr.info(message);
        break;
    }
  }
}
