
import formMarkup from '../template/form.hbs';
import { ListImage } from './listImage';
import { debounce } from 'debounce';
import {ApiImagesService } from './apiService';
import { LoadMore } from './loadMore';
import { ModalImage } from './modal';

export class Gallery {
  constructor({ root = 'main' }) {
    this.root = root;
    this.apiServices = new ApiImagesService({ root: this.root });
    this.listImage = new ListImage({ root: this.root });
  }

  createMarkup = () => {
    document.querySelector(this.root).insertAdjacentHTML('beforeend', formMarkup());
    const formEl = document.getElementById('search-form');
    this.query = formEl.elements.query;
    this.countOnPage = formEl.elements.countOnPage;

    this.isBtnMore = formEl.elements.countOnPage.value ? true : false;
    this.createMarkupLoadMore();
    this.modal = new ModalImage();
  };

  createMarkupLoadMore = () => {
    this.listImage.createMarkupList();
    this.btnMore = document.querySelector('.load-more');
    this.loadBtn = new LoadMore({ btn: this.btnMore });
    this.loadBtn.hidden();
  };

  setEvent = () => {
    this.query.addEventListener('input', debounce(this.getData, 300));
    this.countOnPage.addEventListener('input', debounce(this.changeCount, 300));
    this.listImage.listEl.addEventListener('click', this.modal.listener);
    if (this.isBtnMore) {
      this.setEventLoadmore();
    }
  };

  setEventLoadmore = () => {
    this.loadBtn.show();
    this.btnMore.addEventListener('click', this.btnMoreclick);
  };

  removeEventLoadmore = () => {
    this.loadBtn.hidden();
    this.btnMore.addEventListener('click', this.btnMoreclick);
  };

  btnMoreclick = e => {
    this.loadBtn.setLoad();
    this.getDataService();
  };

  setInfinityScroll = () => {
    if (!this.observer) {
      const option = {
        rootMargin: '0px',
        threshold: 0.6,
      };
      this.observer = new IntersectionObserver(this.isScrolling, option);
    }
    const target = document.querySelector('li:last-child');
    if (target) {
      this.observer.observe(target);
    }
  };

  isScrolling = (entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        observer.unobserve(entry.target);
        this.getDataService();
      }
    });
  };

  removeInfinityScroll = () => {
    const elem = document.querySelector('.gallery li:last-child');
    if (this.observer && elem) {
      this.observer.unobserve(elem);
      this.observer = null;
    }
  };

  getDataService = async value => {
    if (value) {
      this.apiServices.query = value;
    }
    try {
      const data = await this.apiServices.fetchData();
      if (data.hits.length === 0) {
        alert('No Information');
        return;
      }
      const elem = document.querySelector('.gallery li:last-child');
      this.listImage.createMarkupItems(data.hits);
      if (this.isBtnMore && elem) {
        this.scrollTo(elem);
      }
      this.loadBtn.removeLoad();
      if (this.apiServices.isLastPage(data.totalHits)) {
        this.loadBtn.hidden();
      }
      if (!this.isBtnMore) {
        this.setInfinityScroll();
      }
    } catch (error) {
      alert(error);
    }
  };

  getData = e => {
    if (e.target.value.trim()) {
      this.listImage.clearList();
      this.apiServices.page = 1;
      this.getDataService(e.target.value);
    }
  };

  changeCount = e => {
    const cnt = Number(e.target.value);
    if (cnt) {
      this.listImage.clearList();
      this.apiServices.countPageElement = Number(e.target.value);
      if (this.query.value) {
        this.getDataService(this.query.value);
      }
      this.isBtnMore = true;
      this.setEventLoadmore();
      this.removeInfinityScroll();
    } else {
      this.isBtnMore = false;
      this.removeEventLoadmore();
      this.setInfinityScroll();
    }
  };

  scrollTo = el => {
    if (el.nextElementSibling) {
      el.nextElementSibling.scrollIntoView({
        block: 'start',
        behavior: 'smooth',
      });
    }
  };
}