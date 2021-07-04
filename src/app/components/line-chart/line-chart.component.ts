import { Component, OnInit, ViewChild } from '@angular/core';
import startOfMonth from 'date-fns/startOfMonth';
import endOfMonth from 'date-fns/endOfMonth';
import {
  ChartComponent,
  ApexAxisChartSeries,
  ApexChart,
  ApexXAxis,
  ApexDataLabels,
  ApexTitleSubtitle,
  ApexStroke,
  ApexGrid,
  ApexFill,
  ApexMarkers,
  ApexYAxis
} from 'ng-apexcharts';
import { UserStore } from '../../stores/user.store';
import { eachDayOfInterval, format, getDate, isFirstDayOfMonth, endOfWeek, startOfWeek } from 'date-fns';
import { tr } from 'date-fns/locale';
import { Post } from '../../constants/models';
import { getEpochToString } from '../../utilities';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  xaxis: ApexXAxis;
  dataLabels: ApexDataLabels;
  grid: ApexGrid;
  fill: ApexFill;
  markers: ApexMarkers;
  yaxis: ApexYAxis;
  stroke: ApexStroke;
  title: ApexTitleSubtitle;
};

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.scss']
})
export class LineChartComponent implements OnInit {
  @ViewChild('chart') chart: ChartComponent;
  public chartOptions: Partial<ChartOptions>;
  postCount;
  dateArray;
  postForOneDay;
  accounts;
  posts;

  count;

  constructor(private userStore: UserStore) {
    // Active Accounts
    this.userStore.accounts$.subscribe(accounts => {
      this.accounts = accounts.filter(account => account.active);
    });

    // Active Account Posts
    this.userStore.posts$.subscribe(posts => {
      const tempArr = [];
      this.accounts.forEach(account => {
        posts.filter(post => Number(post.account) === account.id).forEach(p => {
          tempArr.push(p);
        });
      });
      // this.count = tempArr.length;
      this.posts = tempArr;
      const day = 1000 * 60 * 60 * 24;
      const startDate = startOfWeek(new Date());
      const endDate = endOfWeek(new Date());
      this.dateArray = [];
      this.postCount = [];
      const diff = (endDate.getTime() - startDate.getTime()) / day;
      for (let i = 0; i <= diff; i++) {
        const x = startDate.getTime() + day * i;
        const y = new Date(x);
        const date = (y.getDate() + '/' + (y.getMonth() + 1) + '/' + y.getFullYear()).toString();
        this.dateArray.push(date);
        this.postForOneDay = this.posts.filter((post) => getEpochToString(post.date, 'dd/MM/yyyy') === date).length;
        this.postCount.push(this.postForOneDay);
        this.postForOneDay = 0;
      }

      this.chartOptions = {
        series: [
          {
            name: 'Post Count',
            data: this.postCount
          }
        ],
        chart: {
          height: 350,
          type: 'line'
        },
        stroke: {
          width: 7,
          curve: 'smooth'
        },
        xaxis: {
          type: 'category',
          categories: this.dateArray
        },
        title: {
          align: 'left',
          style: {
            fontSize: '16px',
            color: '#000'
          }
        },
        fill: {
          type: 'gradient',
          gradient: {
            shade: 'dark',
            gradientToColors: ['rgb(150, 111, 214)'],
            shadeIntensity: 1,
            type: 'horizontal',
            opacityFrom: 1,
            opacityTo: 1,
            stops: [0, 100, 100, 100]
          }
        },
        markers: {
          size: 4,
          colors: ['#FFA41B'],
          strokeColors: '#fff',
          strokeWidth: 2,
          hover: {
            size: 7
          }
        },
        yaxis: {
          min: 0,
          max: 10

        }
      };
    });
  }

  ngOnInit(): void {}

}
