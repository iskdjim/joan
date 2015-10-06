/**
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

		/* 
		 * sample data to plot over time
		 */
		var data = {"start":1347927197173,"end":1347927447125,"step":3600,"names":["Stats_count2xx","Stats_count3xx","Stats_count4xx"],"values":[[140,141, 142, 145, 140,141, 142, 141,140,141, 142, 145, 140,141, 142, 141,140,141, 142, 145, 140,141, 142, 141,140,141, 142, 145, 140,141, 142, 141,140,141, 142, 145, 140,141, 142, 141,140,141, 142, 145, 140,141, 142, 141,140,141, 142, 145, 140,141, 142, 141,144,142,143,140,141, 142, 145, 140,141, 142, 141,140,141, 142, 145, 140,141, 142, 141],[50, 54,51,52,51,52,53, 55,56, 50,55,51,52,53,50, 54,51,52,51,52,53, 55,56, 50,55,51,52,53,50, 54,51,52,51,52,53, 55,56, 50,55,51,52,53,50, 54,51,52,51,52,53, 55,56, 50,55,51,52,53,50, 54,51,52,51,52,53, 55,56, 50,55,51,52,53,50, 54,51,52,51,52,53, 55,56, 50,55,51,52,53],[40,41,42,41,41,41,42,43,42,42,44,40,41,42,41,41,41,42,43,42,42,44,40,41,42,41,41,41,42,43,42,42,44,40,41,42,41,41,41,42,43,42,42,44,40,41,42,41,41,41,42,43,42,42,41,42,41,41,41,42,43,42,42,44,40,41,42,41,41,41,42,43,42,42,44]]};
		/* 
		 * delta updates to data that would be incrementally appended to the original every 2 minutes (120000ms)
		 */
		var dataA = {"start":1347927197173,"end":1347927447125,"step":3600,"names":["Stats_count2xx","Stats_count3xx","Stats_count4xx"],"values":[[140.6826207297],[50.161376855185],[40.3887353437241]]};
