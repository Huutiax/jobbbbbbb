import Vue from "vue";
import "@/styles/inject.scss";
import "@/styles/element-ui.scss";

import {
  Button,
  RadioGroup,
  Radio,
  Checkbox,
  DatePicker,
  Select,
  Option,
  Input,
  Card,
  Form,
  FormItem,
  Table,
  TableColumn,
  Row,
  Col,
  Tag,
  Popover,
  Popconfirm,
  Message,
  Loading,
  Notification,
  Image
} from "element-ui";

Vue.prototype.$ELEMENT = { size: "mini" };

Vue.use(Button);
Vue.use(RadioGroup);
Vue.use(Radio);
Vue.use(Checkbox);
Vue.use(DatePicker);
Vue.use(Select);
Vue.use(Option);
Vue.use(Input);
Vue.use(Card);
Vue.use(Form);
Vue.use(FormItem);
Vue.use(Table);
Vue.use(TableColumn);
Vue.use(Row);
Vue.use(Col);
Vue.use(Tag);
Vue.use(Popover);
Vue.use(Popconfirm);
Vue.use(Image);

Vue.use(Loading.directive);

Vue.prototype.$loading = Loading.service;
Vue.prototype.$message = Message;
Vue.prototype.$notify = Notification;
