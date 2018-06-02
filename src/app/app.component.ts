import {Component, OnInit, OnDestroy} from '@angular/core';
import * as moment from 'moment';
import {Observable, Subscription} from "rxjs/Rx";
import {TimerObservable} from "rxjs/observable/TimerObservable";
import {AppModel} from "./models/app-model";
import * as _ from 'underscore';
import {config} from './config/config.js';
import {TimerModel} from "./models/timer-model";

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
    isStartedTimer = false;
    taskName = '';
    projects = config.projects;
    selectedProject = this.projects[0].name;
    timer: Observable<number>;
    tick: number;
    timerFormated: string = '00:00:00';
    items: AppModel[] = [];
    private subscription: Subscription;

    constructor() {

    }

    ngOnInit() {
        this.timer = TimerObservable.create(1000, 1000);
        this.continueTimer();
        let items = JSON.parse(localStorage.getItem('items'));
        if (items) {
            this.items = items
        }
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    initTimer(time: number): void {
        this.tick = time;
        this.subscription = this.timer.subscribe(() => {
            this.tick += 1;
            let tempTime = moment.duration(this.tick, 's');
            let result = tempTime.hours() + ':' + tempTime.minutes() + ':' + tempTime.seconds();
            this.timerFormated = moment(result, 'Hms').format('HH:mm:ss');
        });
    }

    continueTimer(): void {
        if (localStorage.getItem('startTime')) {
            this.taskName = localStorage.getItem('taskName');
            this.selectedProject = localStorage.getItem('selectedProject');
            this.isStartedTimer = true;
            let now = this.getTime();
            let startTime = localStorage.getItem('startTime');
            let duration = now - parseInt(startTime);
            this.initTimer(duration / 1000)
        }
    }

    startTimer(): void {
        this.isStartedTimer = true;
        this.initTimer(0);
        let startTime = this.getTime();
        localStorage.setItem('startTime', startTime.toString());
    }

    stopTimer(): void {
        this.subscription.unsubscribe();
        this.isStartedTimer = false;
        let stopTime = this.getTime();
        localStorage.setItem('stopTime', stopTime.toString());
        this.saveResult();
    }

    saveResult(): void {
        let startTime = localStorage.getItem('startTime');
        let stopTime = localStorage.getItem('stopTime');
        let duration = parseInt(stopTime) - parseInt(startTime);
        let tempTime = moment.duration(duration);
        let result = tempTime.hours() + ':' + tempTime.minutes() + ':' + tempTime.seconds();
        let formatedResult = moment(result, 'Hms').format('HH:mm:ss');
        let today = _.findWhere(this.items, {date: moment().format('ddd DD MMM YYYY')});
        if (!today) {
            today = {date: moment().format('ddd DD MMM YYYY'), timers: []};
            this.items.push(today);
        }
        today.timers.push({
            task: this.taskName,
            duration: formatedResult,
            start: startTime,
            stop: stopTime,
            project: this.selectedProject
        });

        localStorage.setItem('items', JSON.stringify(this.items));
        localStorage.removeItem('startTime');
        localStorage.removeItem('stopTime');
    }

    onNameChange(): void {
        localStorage.setItem('taskName', this.taskName);
    }

    onProjectChange(): void {
        localStorage.setItem('selectedProject', this.selectedProject);
    }

    getTime(): number {
        let ms = new Date();
        return ms.getTime();
    }

    continueTask(timer: TimerModel): void {
        if (this.isStartedTimer) {
            this.stopTimer()
        }
        this.taskName = timer.task;
        this.selectedProject = timer.project;
        this.startTimer();
    }
}
