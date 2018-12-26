import { Component, OnInit } from '@angular/core';
import { D3Service, D3, Selection } from 'd3-ng2-service';
import { SchoolDataService } from '../management/school/school-data.service';
import { StudentService } from '../student/student.service';
import { FeeBillService } from '../fee/fee-bill/fee-bill.service';
import { School } from '../management/school/school';
import { AdmissionService } from '../application-list/admission.service';
import * as moment from 'moment';


import { Chart } from 'angular-highcharts';
import { StockChart } from 'angular-highcharts';

import { FeeReportService } from '../fee/fee-report/fee-report.service';
import { FeeReport } from '../fee/fee-report/fee-report';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { orderData, testGraphData, statusLevelData, subjectPlanData, years, classes} from './testData';

import { EmployeeService } from '../employees/employee.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  private classindex: Number;
  school: School;
  current_month_data: any[];
  private d3: D3;
  application_count: any;

  public donutChartData: any[];
  public chart_categories: Array<any> = [];
  public daily_collection_report: Array<any> = [];
  public collection_items: Array<any> = [];
  public studentData: any;
  public area_chart: any;
  public area_chart2: any;
  public due_bills_summary_chart: any;
  public modalRef: BsModalRef;
  public student_chat : any;
  public employeer_chart: any;


  public orderData = orderData;
  public testGraphData = testGraphData;
  public statusLevelData = statusLevelData;
  public subjectPlanData: any[];
  public years = years;
  public classes = classes;

  constructor(d3Service: D3Service, public schoolDataService: SchoolDataService, private studentService: StudentService,
    private feeBillService: FeeBillService, private admissionService: AdmissionService, public feeReportService: FeeReportService,
    private modalService: BsModalService, public employeeservice: EmployeeService) {
    this.d3 = d3Service.getD3();
  }

  public openModal(template:any) {
    this.modalRef = this.modalService.show(template, {class: 'modal-lgg'});
  }

  //getSummaryBoxDetails
  ngOnInit() {

    this.employeeservice.getEmployeeList("1e4d12bc2b58050ff084f8da").then(data => {

      var employeer_data = [];

      for (var i = 0; i < data.length; i++) {

          if(employeer_data[data[i].type_code] != undefined ){

            employeer_data[data[i].type_code] = employeer_data[data[i].type_code]+1;

          }else {

            employeer_data[data[i].type_code] = 1;
          }
      }

      var employeer_series_data = [];
      var employeer_key = Object.keys(employeer_data);
 
      for (var i = 0; i < employeer_key.length ; i++) {

          var employeer_series = { name: '', y: 0 };
          employeer_series.name = employeer_key[i]+ ' '+employeer_data[employeer_key[i]];
          employeer_series.y = employeer_data[employeer_key[i]];
          employeer_series_data.push(employeer_series);
      }


      this.employeer_chart = new Chart({
        chart: {
          type: 'pie',
          height:'270px',
          spacingLeft: -150,
          spacingBottom: 0,
          events: {
            load: function(event) {
              var chart = this,
              points = chart.series[0].points,
              len = points.length,
              total = 0,
              i = 0;

              for (; i < len; i++) {
                total += points[i].y;
              }
              chart.setTitle({
                useHTML:true,
                text: '<h2 style="margin: 7px 0 !important">' + total +'</h2>',
                align: 'center',
                verticalAlign: 'middle',
                y: -10,
                style: {
                  fontWeight: 'bold'
                },
              });
            }
          }
        },
        tooltip: {
          formatter: function() {
            return '<b>' + this.point.name + '</b>';
          }
        },
        legend: {
          useHTML:true,
          enabled: true,
          floating: true,
          borderWidth: 0,
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle',
          labelFormatter: function() {
            var html = '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous">';
            html += ' '+ this.name;
            return html;
          }
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        plotOptions: {
          pie: {
            shadow: false,
            showInLegend: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            }
          }
        },
        series: [{
          name: 'Browsers',
          data: employeer_series_data,
          size: '60%',
          innerSize: '65%',
        }]
      });



    })

    this.classindex = 0;
    this.school = this.schoolDataService.getSchool();
    this.studentService.getSchoolStudentData(this.school.school_id)
    .then(studentData => {

      this.student_chat = new Chart({
        chart: {
          renderTo: 'container',
          type: 'pie',
          height:'270px',
          spacingLeft: -150,
          spacingBottom: 0,
          events: {
            load: function(event) {
              var chart = this,
              points = chart.series[0].points,
              len = points.length,
              total = 0,
              i = 0;

              for (; i < len; i++) {
                total += points[i].y;
              }
              chart.setTitle({
                useHTML:true,
                text: '<h2 style="margin:7px 0 !important">' + total +'</h2>',
                align: 'center',
                verticalAlign: 'middle',
                y: -10,
                style: {
                  fontWeight: 'bold'
                },
              });
            }
          }
        },
        tooltip: {
          formatter: function() {
            return '<b>' + this.point.name + '</b>';
          }
        },
        legend: {
          useHTML:true,
          enabled: true,
          floating: true,
          borderWidth: 0,
          align: 'right',
          layout: 'vertical',
          verticalAlign: 'middle',
          labelFormatter: function() {
            var html = '<link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.1/css/all.css" integrity="sha384-gfdkjb5BdAXd+lj+gudLWI+BXq4IuLW5IT+brZEZsLFm++aCMlF1V92rMkPaX4PP" crossorigin="anonymous">';
            html += ' '+ this.name;
            return html;
          }
        },
        yAxis: {
          title: {
            text: ''
          }
        },
        plotOptions: {
          pie: {
            shadow: false,
            showInLegend: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            }
          }
        },
        series: [{
          name: 'Browsers',
          data: [{
            name: '<i class="fas fa-female"></i> Girls ' + studentData.total_girls_count,
            y: studentData.total_girls_count,
            color: '#ffb4c1f7'
          }, {
            name: '<i class="fas fa-male"></i> Boys ' + studentData.total_boys_count,
            y: studentData.total_boys_count,
            color: '#6cc8da'
          }],
          size: '60%',
          innerSize: '65%',
        }]
      });


      this.studentData = studentData;
      this.donutChartData = [{
        id: 0,
        label: 'Girls ' + studentData.total_girls_count,
        value: studentData.total_girls_count,
        color: '#ffb4c1f7'
      }, {
        id: 1,
        label: 'Boys ' + studentData.total_boys_count,
        value: studentData.total_boys_count,
        color: '#6cc8da'
      }];
    });

    // this.feeBillService.getBillCollectionData(this.school.school_id)
    //   .then(feeBillData => {
    //     console.log('feeBillData', feeBillData);
    //     this.initOverdueBillsChart(feeBillData);
    //     this.initBillsCollectedPieChart(feeBillData);
    //     this.initBillsCollectedLineChart(feeBillData);
    //   });


    let report_param = new FeeReport();
    report_param.school_key = "1e4d12bc2b58050ff084f8da",
    report_param.report_type = 'DUE_BILLS';
    this.feeReportService.getFeeReportByType(report_param).then(resp=>{

      this.due_bills_summary_chart = new Chart({
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie',
          height: '320px',
          spacingLeft: -200,
          spacingBottom: 0,
        },
        title: {
          text: '.',
          style :{
            color:'transparent',
            fill: 'transparent'
          }
        },
        tooltip: {
          pointFormat: ''
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: true,
              format: '{point.percentage:.1f} %',
              distance: -50,
            },
            showInLegend: true
          }
        },

      /*  legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          floating: true,
          backgroundColor: '#FFFFFF'
        },
          plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
              enabled: false
            },
            showInLegend: true
          }
        },*/

        legend: {
          layout: 'vertical',
          align: 'right',
          verticalAlign: 'middle',
          floating: true,
          rtl: true,
          useHTML:true,
          labelFormatter: function() {
            return '<table style="width:120px"><tr><td style="text-align:left;width:70px;padding:0 !important; border-bottom:none !important ">'+this.name+'</td><td style="text-align:right;padding:0 !important;border-bottom:none !important">₹ '+this.y+'</td></tr></table>';
          }
        },
        series: [{
          name: 'Percentage',
          //colorByPoint: true,
          data: [{
            name: 'DUE',
            y: 18.98,
            color: '#ff9222'
            // sliced: true,
            // selected: true
          }, {
            name: 'OVERDUE',
            y: 18.98,
            color:'#d05f50'
          }, {
            name: 'PAID',
            y: 9.5,
            color:'#bce4a1'
          }]
        }]
      });
    });

    let params = new FeeReport();
    params.school_key = "1e4d12bc2b58050ff084f8da";
    params.report_type = "DAILY_COLLECTION";

    this.feeReportService.getFeeReportByType(params).then(data => {

      for (var i = 0; i < data.length; i++) {
        this.chart_categories.push(Date.parse(data[i].daily_collection_report.collection_date));
        this.daily_collection_report.push(data[i].daily_collection_report);
      }

      this.chart_categories.sort(function(a, b){return a-b});

      for (var j  = 0; j < this.chart_categories.length; j++) {

        var month : any ;
        var year : any;
        var day : any;

        day   =  new Date(this.chart_categories[j]).getDate();
        month = new Date(this.chart_categories[j]).getMonth()+1;
        year  = new Date(this.chart_categories[j]).getFullYear();

        if (month < 10) {
          month = `0${month}`;
        }

        if (day < 10) {
          day = `0${day}`;
        }

        var date  = `${year}-${month}-${day}`;

        this.chart_categories[j] = date;
      }

      var my_fee = ['Computer Fee', 'Tution Fee', 'Communication Fee', 'Library Fee', 'Lab Fee', 'SMS Fee', 'Special Tution Fee', 'Admission Fee', 'Covience Fee', 'Transport Fee'];

      for (var m = 0; m < this.chart_categories.length; ++m) {
        for (var k = 0; k < this.daily_collection_report.length; ++k) {
          if ( this.chart_categories[m] == this.daily_collection_report[k].collection_date) {
            this.collection_items.push(this.daily_collection_report[k].collection_items);
          }
        }
      }

      var series_for_smal_chart = [];
      var series_for_full_chart = [];

      for (var j = 0; j < my_fee.length; j++) {

          var fee_item = [];

        for (var i = 0; i < this.collection_items.length; i++) {

              var bool = false;

              for (var k = 0; k < this.collection_items[i].length; k++) {

                if ( my_fee[j] == this.collection_items[i][k].name ){
                  bool = true;
                  fee_item.push(this.collection_items[i][k].total_amount);
                }

              }

              if(bool == false){
                fee_item.push( 0);
              }

          }

          var chart_data_for_smal_chart = {'name':'', 'data':[], showInLegend: false };
          var chart_data_for_full_chart = {'name':'', 'data':[] };

          chart_data_for_smal_chart.name = my_fee[j];
          chart_data_for_smal_chart.data = fee_item;
          chart_data_for_full_chart.name = my_fee[j];
          chart_data_for_full_chart.data = fee_item;

          series_for_smal_chart.push(chart_data_for_smal_chart);
          series_for_full_chart.push(chart_data_for_full_chart);

      }

    this.area_chart = new Chart({
          chart: {
            type: 'area',
            height: '320px',
          },
          navigation: {
            buttonOptions: {
                enabled: false
            }
          },
          title: {
            text: 'Daily Collection Fee'
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            categories: this.chart_categories,
            tickmarkPlacement: 'on',
            labels: {
              style: {
                color: '#fff',
                display: 'none'
              }
            }
          },
          yAxis: {
            title: {
              text: 'Values'
            },
            labels: {
              formatter: function () {
                return this.value;
              }
            }
          },
          tooltip: {
            split: true,
            valuePrefix: '₹ '
          },
          plotOptions: {
            area: {
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              marker: {
                lineWidth: 1,
                lineColor: '#666666'
              }
            }
          },
          series: series_for_smal_chart
        });

    this.area_chart2 = new Chart({
          chart: {
            type: 'area',
            height: '500px'
          },
          title: {
            text: 'Daily Collection Fee'
          },
          subtitle: {
            text: ''
          },
          xAxis: {
            categories: this.chart_categories,
            tickmarkPlacement: 'on',
          },
          yAxis: {
            title: {
              text: 'Values'
            },
            labels: {
              formatter: function () {
                return this.value;
              }
            }
          },
          tooltip: {
            split: true,
            pointFormat: '{series.name}: <b>{point.y}</b><br/>',
            valuePrefix: '₹ '
          },
          plotOptions: {
            area: {
              stacking: 'normal',
              lineColor: '#666666',
              lineWidth: 1,
              marker: {
                lineWidth: 1,
                lineColor: '#666666'
              }
            }
          },
          series: series_for_full_chart
        });
    });

    this.testGraphData = [
    {
      title: 'Division B',
      value: [
      {
        status: true,
        values: [
        {
          value: `${this.count(0, 30)}`,
          background: '#d05f50',
        }, {
          value: `${this.count(0, 30)}`,
          background: '#ff9222',
        }, {
          value: `${this.count(30, 30)}`,
          background : '#bce4a1'
        }

        ]
      }, {
        status: true,
        values: [
        {
          value: `${this.count(1, 30)}`,
          background: '#d05f50',
        }, {
          value: `${this.count(0, 30)}`,
          background: '#ff9222',
        }, {
          value: `${this.count(29, 30)}`,
          background: '#bce4a1',
        },
        ]
      }
      ]
    },
    {
      title: 'Division A',
      value: [
      {
        status: true,
        values: [
        {
          value: `${this.count(5, 30)}`,
          background: '#d05f50',
        }, {
          value: `${this.count(2, 30)}`,
          background: '#ff9222',
        }, {
          value : `${this.count(23, 30)}`,
          background : '#bce4a1'
        }

        ]
      }, {
        status: true,
        values: [
        {
          value: `${this.count(10, 27)}`,
          background: '#d05f50',
        }, {
          value: `${this.count(2, 27)}`,
          background: '#ff9222',
        }, {
          value: `${this.count(15, 27)}`,
          background: '#bce4a1',
        },
        ]
      }
      ]
    }
    ]

    this.admissionService.getSummaryBoxDetails(this.school.school_id)
      .then(response => {
        this.application_count = 0;
        for (var i = 0; i < response.length; i++) {
          this.application_count += response[i].count;
        }
        console.log('application_count', this.application_count);
        this.iniApplicationsPieChart(response);
      }).catch( response => {
        console.log("Application Data could not be loaded")
      })
  }

  count(x, y) {
    return x/y*100;
  }

  initOverdueBillsChart = function (feeBillData) {
    let d3 = this.d3;
    const graphContainer = d3.select('.d3--line');
    const svg = d3.select('svg');
    const margin = { top: 60, right: 50, bottom: 50, left: 50 };
    const duration = 500;
    let width, height, innerWidth, innerHeight;
    let xScale, yScale;

    const DATA1 = feeBillData.map(function (feeBill) {
      return feeBill.overdue_bills_count;
    });
    const DATA2 = feeBillData.map(function (feeBill) {
      return feeBill.overdue_bills_count;
    });
    // console.log(DATA2);
    const LABELS = feeBillData.map(function (feeBill) {
      return feeBill.month.toUpperCase();
    });

    (function init() {
      getDimentions();
      getScaleDomains();
      getScaleRanges();
      renderGraph(DATA1, DATA2);
    })();


    d3.select(window).on('resize', resize);

    function resize() {
      destroyGraph();
      getDimentions();
      getScaleRanges();
      renderGraph(DATA1, DATA2);
    }

    function renderGraph(DATA1, DATA2) {
      if (!DATA1.length || !LABELS.length) {
        return false;
      }

      const line = d3.line()
        .x((d, i) => xScale(LABELS[i]))
        .y((d) => yScale(d))
        .curve(d3.curveCatmullRom.alpha(0.5));

      const area = d3.area()
        .x((d, i) => xScale(LABELS[i]))
        .y0(innerHeight)
        .y1(d => yScale(d))
        .curve(d3.curveCatmullRom.alpha(0.5));

      const xAxis = d3.axisBottom(xScale)
        .tickFormat((d, i) => LABELS[i]);

      const yAxis = d3.axisLeft(yScale)
        .ticks(4);

      svg
        .attr('width', width)
        .attr('height', height);

      const inner = svg.selectAll('g.inner')
        .data([null]);
      inner.exit().remove();
      inner.enter().append('g').attr('class', 'inner')
        .attr('transform', `translate(${margin.top}, ${margin.right})`);

      // const horizontalLineGroup = svg.selectAll('g.inner').selectAll('.line-group')
      //   .data([null]);
      // horizontalLineGroup.exit().remove();
      // horizontalLineGroup.enter().append('g').attr('class', 'line-group');

      const horizontalLine = svg.selectAll('g.line-group').selectAll('.grid-line')
        .data(yScale.ticks(4));
      horizontalLine.exit().remove();
      horizontalLine.enter().append('line').attr('class', 'grid-line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d));

      const xa = svg.selectAll('g.inner').selectAll('g.x.axis')
        .data([null])
      xa.exit().remove();
      xa.enter().append('g').attr('class', 'x axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis);

      const ya = svg.selectAll('g.inner').selectAll('g.y.axis')
        .data([null])
      ya.exit().remove();
      ya.enter().append('g').attr('class', 'y axis')
        .call(yAxis);


      const pathLine2 = svg.selectAll('g.inner').selectAll('.path-line2')
        .data([null]);
      pathLine2.exit().remove();
      pathLine2.enter().append('path').attr('class', 'path-line path-line2')
        .attr('d', () => line(createZeroDataArray(DATA2)))
        .transition()
        .duration(duration)
        .ease(d3.easePoly.exponent(2))
        .attr('d', () => line(DATA2));

      const pathArea2 = svg.selectAll('g.inner').selectAll('.path-area2')
        .data([null]);
      pathArea2.exit().remove();
      pathArea2.enter().append('path').attr('class', 'path-area path-area2')
        .attr('d', () => area(createZeroDataArray(DATA2)))
        .transition()
        .duration(duration)
        .ease(d3.easePoly.exponent(2))
        .attr('d', area(DATA2));
      // .style('filter', 'url(#dropshadow)');

      // const pathLine1 = svg.selectAll('g.inner').selectAll('.path-line1')
      //   .data([null]);
      // pathLine1.exit().remove();
      // pathLine1.enter().append('path').attr('class', 'path-line path-line1')
      //   .attr('d', () => line(createZeroDataArray(DATA1)))
      //   .transition()
      //   .duration(duration)
      //   .ease(d3.easePoly.exponent(2))
      //   .attr('d', line(DATA1));

      // const pathArea1 = svg.selectAll('g.inner').selectAll('.path-area1')
      //   .data([null]);
      // pathArea1.exit().remove();
      // pathArea1.enter().append('path').attr('class', 'path-area path-area1')
      //   .attr('d', () => area(createZeroDataArray(DATA1)))
      //   .transition()
      //   .duration(duration)
      //   .ease(d3.easePoly.exponent(2))
      //   .attr('d', area(DATA1))
      //   .style('filter', 'url(#dropshadow)');
    }

    function destroyGraph() {
      svg.selectAll('*').remove();
    }

    function getDimentions() {
      width = graphContainer.node().clientWidth;
      height = 250;
      innerWidth = width - margin.left - margin.right;
      innerHeight = height - margin.top - margin.bottom;
    }

    function getScaleRanges() {
      xScale.range([0, innerWidth]).paddingInner(1);
      yScale.range([innerHeight, 0]).nice();
    }

    function getScaleDomains() {
      xScale = d3.scaleBand().domain(LABELS);
      yScale = d3.scaleLinear().domain([0, d3.max([d3.max(DATA1), d3.max(DATA2)])]);
    }

    function createZeroDataArray(arr) {
      const newArr = [];
      arr.forEach((item, index) => newArr[index] = 0);
      return newArr;
    }

    // console.log('refres   h')
  }

  initBillsCollectedLineChart = function (feeBillData) {
    let d3 = this.d3;
    const graphContainer = d3.select('#d3-line');
    const svg = graphContainer.select('svg');
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };
    const duration = 500;
    let width, height, innerWidth, innerHeight;
    let xScale, yScale;

    const DATA1 = feeBillData.map(function (feeBill) {
      return feeBill.overdue_bills_count;
    });
    const DATA2 = feeBillData.map(function (feeBill) {
      return feeBill.overdue_bills_count;
    });
    const LABELS = feeBillData.map(function (feeBill) {
      return feeBill.month.toUpperCase();
    });

    (function init() {
      getDimentions();
      getScaleDomains();
      getScaleRanges();
      renderGraph(DATA1, DATA2);
    })();


    d3.select(window).on('resize', resize);

    function resize() {
      destroyGraph();
      getDimentions();
      getScaleRanges();
      renderGraph(DATA1, DATA2);
    }

    function renderGraph(DATA1, DATA2) {
      if (!DATA1.length || !LABELS.length) {
        return false;
      }

      const line = d3.line()
        .x((d, i) => xScale(LABELS[i]))
        .y((d) => yScale(d))
        .curve(d3.curveCatmullRom.alpha(0.5));

      const area = d3.area()
        .x((d, i) => xScale(LABELS[i]))
        .y0(innerHeight)
        .y1(d => yScale(d))
        .curve(d3.curveCatmullRom.alpha(0.5));

      const xAxis = d3.axisBottom(xScale)
        .tickFormat((d, i) => LABELS[i]);

      const yAxis = d3.axisLeft(yScale)
        .ticks(4);

      svg
        .attr('width', width)
        .attr('height', height);

      const inner = svg.selectAll('g.inner')
        .data([null]);
      inner.exit().remove();
      inner.enter().append('g').attr('class', 'inner')
        .attr('transform', `translate(${margin.top}, ${margin.right})`);

      // const horizontalLineGroup = svg.selectAll('g.inner').selectAll('.line-group')
      //   .data([null]);
      // horizontalLineGroup.exit().remove();
      // horizontalLineGroup.enter().append('g').attr('class', 'line-group');

      const horizontalLine = svg.selectAll('g.line-group').selectAll('.grid-line')
        .data(yScale.ticks(4));
      horizontalLine.exit().remove();
      horizontalLine.enter().append('line').attr('class', 'grid-line')
        .attr('x1', 0)
        .attr('x2', innerWidth)
        .attr('y1', d => yScale(d))
        .attr('y2', d => yScale(d));

      const xa = svg.selectAll('g.inner').selectAll('g.x.axis')
        .data([null])
      xa.exit().remove();
      xa.enter().append('g').attr('class', 'x axis')
        .attr('transform', `translate(0, ${innerHeight})`)
        .call(xAxis);

      // const ya = svg.selectAll('g.inner').selectAll('g.y.axis')
      //   .data([null])
      // ya.exit().remove();
      // ya.enter().append('g').attr('class', 'y axis')
      //   .call(yAxis);

      const pathLine1 = svg.selectAll('g.inner').selectAll('.path-line1')
        .data([null]);
      pathLine1.exit().remove();
      pathLine1.enter().append('path').attr('class', 'path-line path-line1')
        .attr('d', () => line(createZeroDataArray(DATA1)))
        .transition()
        .duration(duration)
        .ease(d3.easePoly.exponent(2))
        .attr('d', line(DATA1));

      const pathArea1 = svg.selectAll('g.inner').selectAll('.path-area1')
        .data([null]);
      pathArea1.exit().remove();
      pathArea1.enter().append('path').attr('class', 'path-area path-area1')
        .attr('d', () => area(createZeroDataArray(DATA1)))
        .transition()
        .duration(duration)
        .ease(d3.easePoly.exponent(2))
        .attr('d', area(DATA1));
      // .style('filter', 'url(#dropshadow)');
    }

    function destroyGraph() {
      svg.selectAll('*').remove();
    }

    function getDimentions() {
      width = graphContainer.node().clientWidth;
      height = 250;
      innerWidth = width - margin.left - margin.right;
      innerHeight = height - margin.top - margin.bottom;
    }

    function getScaleRanges() {
      xScale.range([0, innerWidth]).paddingInner(1);
      yScale.range([innerHeight, 0]).nice();
    }

    function getScaleDomains() {
      xScale = d3.scaleBand().domain(LABELS);
      yScale = d3.scaleLinear().domain([0, d3.max([d3.max(DATA1), d3.max(DATA2)])]);
    }

    function createZeroDataArray(arr) {
      const newArr = [];
      arr.forEach((item, index) => newArr[index] = 0);
      return newArr;
    }

    // console.log('refres   h')
  }

  initBillsCollectedPieChart = function (feeBillData) {
    var current_month = moment().format('MMM');
    var current_year = moment().format('YYYY');
    this.current_month_data = feeBillData.filter(function (feeData) {
      return feeData.month.toLowerCase() == current_month.toLowerCase() && feeData.year == current_year;
    });
    console.log('current_month_data', this.current_month_data);
    let d3 = this.d3;
    var donut = this.donutChart();

    var data = [];
    if(this.current_month_data[0]){
      data = [
        {
          "Fees": "Collected",
          "Value": this.current_month_data[0].bills_amount_collected
        },
        {
          "Fees": "Not Collected",
          "Value": this.current_month_data[0].bills_amount_due
        }
      ];
    }
    if(this.current_month_data[0]){
      d3.select('#pie-chart')
        .datum(data) // bind data to the div
        .call(donut); // draw chart in div
      }
    }

  donutChart = function () {
    let d3 = this.d3;
    var width = 320,
      height = 210,
      margin = { top: 10, right: 10, bottom: 10, left: 10 },
      colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
      variable = 'Value', // value in data that will dictate proportions on chart
      category = 'Fees', // compare data by
      padAngle = 0.085, // effectively dictates the gap between slices
      floatFormat = d3.format('.4r'),
      cornerRadius = 5, // sets how rounded the corners are on each slice
      percentFormat = d3.format('%');

    var chart = function (selection) {
      selection.each(function (data) {
        var radius = Math.min(width, height) / 2;

        var pie = d3.pie()
          .value(function (d) { return floatFormat(d[variable]); })
          .sort(null);

        var arc = d3.arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.5)
          .cornerRadius(cornerRadius)
          .padAngle(padAngle);


        var outerArc = d3.arc()
          .outerRadius(radius * 1.9)
          .innerRadius(radius * 1.9);

        var svg = selection
          .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + (width / 2.8) + ',' + height / 1.8 + ')');

        svg.append('g').attr('class', 'slices');
        svg.append('g').attr('class', 'labelName');
        svg.append('g').attr('class', 'lines');

        var colors = [],
          slice = 0,
          inPad = false,
          padding = 0.04;


        var path = svg.select('.slices')
          .datum(data).selectAll('path')
          .data(pie)
          .enter().append('path')
          .style('fill', function (d) {
            // console.log('d', d);
            // return 'url(#red_black)';
            if (d.data.Fees == 'Collected') {
              return 'url(#red_black)';
            }
            else
              return 'none';
          })
          .style('stroke', function (d) {
            // return 'url(#red_black_border)';
            if (d.data.Fees == 'Collected') {
              return 'url(#red_black_border)';
            }
            else
              return 'none';
          })
          .style('stroke-width', '2')
          // .style('stroke-fill','url(#red_black_border)')
          // .attr('fill', function (d) {
          //   return d.fill;
          // })
          .attr('d', arc);
        // .style('filter', 'url(#dropshadow-pie)');

        // var label = svg.select('.labelName').selectAll('text')
        //   .data(pie)
        //   .enter().append('text')
        //   .attr('dy', '.35em')
        //   .html(function (d) {
        //     // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
        //     return d.data[category] + ': <tspan>' + percentFormat(d.data[variable]) + '</tspan>';
        //   })
        //   .attr('transform', function (d) {
        //     var pos = outerArc.centroid(d);
        //     pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        //     return 'translate(' + pos + ')';
        //   })
        //   .style('text-anchor', function (d) {
        //     return (midAngle(d)) < Math.PI ? 'start' : 'end';
        //   });

        // var polyline = svg.select('.lines')
        //   .selectAll('polyline')
        //   .data(pie)
        //   .enter().append('polyline')
        //   .attr('points', function (d) {

        //     // see label transform function for explanations of these three lines.
        //     var pos = outerArc.centroid(d);
        //     pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        //     return [arc.centroid(d), outerArc.centroid(d), pos]
        //   });

        d3.selectAll('.labelName text, .slices path').call(toolTip);

        function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

        function toolTip(selection) {

          svg.append('text')
            .attr('dy', 108)
            .style('font-size', '1.5em')
            .style('text-anchor', 'middle')
            .style('fill', '#aaaaaa')
            .html(moment().format('MMM').toUpperCase());

          svg.append('text')
            .attr('class', 'toolCircleBillsCollected')
            .attr('dy', 10) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
            .html(toolTipHTML(data)) // add text to the circle.
            .style('font-size', '2em')
            .style('fill', '#aaaaaa')
            .style('text-anchor', 'middle'); // centres text in tooltip

          svg.append('circle')
            .attr('class', 'toolCircleBillsCollected')
            .attr('r', radius * 0.50) // radius of tooltip circle
            .style('fill', '#ffffff') // colour based on category mouse is over
            .style('fill-opacity', 0.35);
        }

        function toolTipHTML(data) {

          var tip = '',
            i = 0;

          tip = ((data[0].Value / data[1].Value * 100).toFixed(0).toString()) + "%";

          // for (var key in data.data) {

          //   // if value is a number, format it as a percentage
          //   var value = (!isNaN(parseFloat(data.data[key]))) ? percentFormat(data.data[key]) : data.data[key];
          //   tip +=
          //     // if (i === 0) tip += '<tspan x="0">' + key + ': ' + value + '</tspan>';
          //     // else tip += '<tspan x="0" dy="1.2em">' + key + ': ' + value + '</tspan>';
          //     i++;
          // }

          return tip;
        }

      });
    }

    return chart;
  }

  iniApplicationsPieChart = function (applicationdata) {
    //applications-pie-chart
    let d3 = this.d3;
    var donut = this.donutChart1();
    var data = [
      {
        "Status": "NEW",
        "Value": 0.056
      },
      {
        "Status": "INPROGRESS",
        "Value": 0.044
      }
    ];
    d3.select('#applications-pie-chart')
      .datum(applicationdata) // bind data to the div
      .call(donut); // draw chart in div
  }

  donutChart1 = function () {
    let d3 = this.d3;
    var width = 320,
      height = 160,
      margin = { top: 10, right: 10, bottom: 10, left: 10 },
      colour = d3.scaleOrdinal(d3.schemeCategory20c), // colour scheme
      variable = 'count', // value in data that will dictate proportions on chart
      category = 'status', // compare data by
      padAngle = 0.185, // effectively dictates the gap between slices
      floatFormat = d3.format('.4r'),
      cornerRadius = 5, // sets how rounded the corners are on each slice
      percentFormat = d3.format(',.2%');

    var chart = function (selection) {
      selection.each(function (data) {
        var radius = Math.min(width, height) / 2;

        var pie = d3.pie()
          .value(function (d) { return floatFormat(d[variable]); })
          .sort(null);

        var arc = d3.arc()
          .outerRadius(radius * 0.8)
          .innerRadius(radius * 0.6)
          .cornerRadius(cornerRadius)
          .padAngle(padAngle);


        var outerArc = d3.arc()
          .outerRadius(radius * 1.9)
          .innerRadius(radius * 1.9);

        var svg = selection
          // .attr('width', width + margin.left + margin.right)
          .attr('height', height + margin.top + margin.bottom)
          .append('g')
          .attr('transform', 'translate(' + (width / 2.8) + ',' + height / 1.8 + ')');

        svg.append('g').attr('class', 'slices');
        svg.append('g').attr('class', 'labelName');
        svg.append('g').attr('class', 'lines');

        var colors = [],
          slice = 0,
          inPad = false,
          padding = 0.04;


        var path = svg.select('.slices')
          .datum(data).selectAll('path')
          .data(pie)
          .enter().append('path')
          .style('fill', 'url(#green_blue)')
          .style('stroke', 'url(#green_blue_border)')
          //  function (d) {
          //   if (d.data.Fees == 'Collected') {
          //     return 'url(#red_black_border)';
          //   }
          //   else
          //     return 'none';
          // })
          .style('stroke-width', '2')
          // .style('stroke-fill','url(#red_black_border)')
          // .attr('fill', function (d) {
          //   return d.fill;
          // })
          .attr('d', arc);
        // .style('filter', 'url(#dropshadow-pie)');

        // var label = svg.select('.labelName').selectAll('text')
        //   .data(pie)
        //   .enter().append('text')
        //   .attr('dy', '.35em')
        //   .html(function (d) {
        //     // add "key: value" for given category. Number inside tspan is bolded in stylesheet.
        //     return d.data[category] + ': <tspan>' + percentFormat(d.data[variable]) + '</tspan>';
        //   })
        //   .attr('transform', function (d) {
        //     var pos = outerArc.centroid(d);
        //     pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        //     return 'translate(' + pos + ')';
        //   })
        //   .style('text-anchor', function (d) {
        //     return (midAngle(d)) < Math.PI ? 'start' : 'end';
        //   });

        // var polyline = svg.select('.lines')
        //   .selectAll('polyline')
        //   .data(pie)
        //   .enter().append('polyline')
        //   .attr('points', function (d) {

        //     // see label transform function for explanations of these three lines.
        //     var pos = outerArc.centroid(d);
        //     pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        //     return [arc.centroid(d), outerArc.centroid(d), pos]
        //   });

        d3.selectAll('#applications-pie-chart .labelName text,#applications-pie-chart .slices path').call(toolTipApplications);

        function midAngle(d) { return d.startAngle + (d.endAngle - d.startAngle) / 2; }

        function toolTipApplications(selection) {
          selection.on('mouseenter', function (data) {

            svg.append('text')
              .attr('class', 'toolCircle')
              .attr('dy', -15) // hard-coded. can adjust this to adjust text vertical alignment in tooltip
              .html(toolTipHTMLApplications(data)) // add text to the circle.
              .style('font-size', '.9em')
              .style('text-anchor', 'middle'); // centres text in tooltip

            svg.append('circle')
              .attr('class', 'toolCircle')
              .attr('r', radius * 0.55) // radius of tooltip circle
              .style('fill', 'none') // colour based on category mouse is over
              .style('fill-opacity', 0.35);

          });

          // remove the tooltip when mouse leaves the slice/label
          selection.on('mouseout', function () {
            d3.selectAll('.toolCircle').remove();
          });
        }

        function toolTipHTMLApplications(data) {

          var tip = '',
            i = 0;

          for (var key in data.data) {

            // if value is a number, format it as a percentage
            var value = data.data[key];
            if (i === 0)
              tip += '<tspan x="0" dy="0.005em" class="tspan-key">' + value + '</tspan>';
            else
              tip += '<tspan x="0" dy="1.2em" class="tspan-value">' + value + '</tspan>';
            i++;
          }

          return tip;
        }

      });
    }

    return chart;
  }
}
